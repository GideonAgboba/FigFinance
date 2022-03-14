/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const AminSchema = mongoose.Schema({
  name: { type: String, required: '{PATH} is required!' },
  email: { type: String, required: '{PATH} is required!', unique: true },
  password: { type: String, required: '{PATH} is required!' },
  role: { type: String, enum: ['admin', 'super'], default: 'admin' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

AminSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      // eslint-disable-next-line no-underscore-dangle
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: '30d',
    },
  )
}

AminSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  // eslint-disable-next-line no-underscore-dangle
  delete obj.__v
  return obj
}

const AdminModel = mongoose.model('Admin', AminSchema)

export default AdminModel
