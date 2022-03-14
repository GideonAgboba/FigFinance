/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import util from 'util'
import { ResMsg } from '../utils'
import AdminModel from '../components/admin/models/admin'

const jwtVerifyAsync = util.promisify(jwt.verify)

config()
export const checkUserToken = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token']
    } else if (req.headers.token) {
      token = req.headers.token
    }
    if (!token) {
      return res.status(400).send({
        status: 'error',
        error: 'No token provided',
      })
    }
    return next()
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    })
  }
}

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers['x-access-token']
    if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token']
    } else if (req.headers.token) {
      token = req.headers.token
    }
    if (!token) return ResMsg(res, 400, 'error', 'unauthenticated from middleware.', null)
    const userObject = await jwtVerifyAsync(token, process.env.JWT_PRIVATE_KEY)
    req.user = userObject
    return next()
  } catch (error) {
    return ResMsg(res, 403, 'error', error.message, error)
  }
}

export const verifyAdmin = async (req, res, next) => {
  try {
    const roles = ['admin', 'super']
    const admin = await AdminModel.findById(req.user.admin)
    console.log(admin)
    if (admin.status !== 'active') return ResMsg(res, 401, 'error', 'account inactive, contact admin.', null)

    if (!roles.includes(admin.role)) return ResMsg(res, 401, 'error', 'unauthorized.', null)

    return next()
  } catch (error) {
    return ResMsg(res, 403, 'error', error.message, error)
  }
}
export const verifySuper = async (req, res, next) => {
  try {
    const roles = ['super']
    if (!roles.includes(req.user.role)) return ResMsg(res, 401, 'error', 'unauthorized.', null)
    return next()
  } catch (error) {
    return ResMsg(res, 403, 'error', error.message, error)
  }
}
