/* eslint-disable import/prefer-default-export */
/* eslint no-underscore-dangle: 0 */

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: '{PATH} is required' },
    email: { type: String, required: '{PATH} is required', unique: true },
    password: { type: String, required: '{PATH} is required' },
    gender: { type: String, required: false, enum: ['male', 'female'] },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    phone: {
      type: String,
      required: '{PATH} is required',
      index: {
        unique: true,
        partialFilterExpression: { phone: { $type: 'string' } },
      },
      default: null,
    },
  },
  { timestamps: true },
);

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: '90 days',
    },
  );
};

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

UserSchema.index({
  name: 'text',
});

const User = mongoose.model('User', UserSchema);

export default User;
