import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: { type: 'String', required: [true, 'User must have a name'] },
  email: {
    type: 'String',
    required: [true, 'User must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: 'String',
    required: 'User must have a password',
    milength: 8,
  },
  passwordConfirmation: {
    type: 'String',
    required: 'User must have a password confirmation',
  },
});

const User = mongoose.model('User', userSchema);

export { User };
