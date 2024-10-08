import { User } from '../models/userModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import { AppError } from '../utils/appError.js';
import { promisify } from 'util';
import { Tour } from '../models/tourModel.js';
import sendEmail from '../utils/email.js';
import { subscribe } from 'diagnostics_channel';

configDotenv();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  console.log(newUser._id);

  const token = signToken(newUser._id);

  console.log(token);

  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if user and password is correct

  const user = await User.findOne({ email }).select('+password');

  console.log(user.password, 'Login func. password  ');

  if (!user || !(await user.correctPassword(password, user.password)))
    next(new AppError('Incorrect email or password', 401));

  // 3) If everything ok,send token to client
  const token = signToken(user._id);
  res.status(200).json({ status: 'ok', token });
});

export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there

  const auth = req.headers.authorization;
  let token;

  if (auth && auth.startsWith('Bearer')) {
    token = auth.split(' ')[1];
  }

  if (!token) {
    next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }

  // 2) Verification token

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN,
  );

  // 3) Check if user still exists

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist'),
      401,
    );
  }

  // 4) Check if user changed password after the JWT token was issued

  console.log(decoded);

  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again', 401),
    );
  }

  // Grant Access to protected route

  console.log(currentUser);

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403),
      );
    }

    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email address ', 404));
  }

  // 2) Generate the random reset password

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Sent it to user's mail

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your passwword? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget your password. Please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'Success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) Of tpken has not expired, and there is user, set the new password

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in, sent JWT

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {});
