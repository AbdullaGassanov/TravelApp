import { User } from '../models/userModel.js';
import { catchAsync } from '../utils/catchAsync.js';

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  console.log(req.body);

  res.status(201).json({
    status: 'success',
    data: { newUser },
  });
});
