/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import util from "util";
import { ResMsg } from "../utils";
import { Admin } from "../components/admin/models";
import User from "../components/user/userModel";
import asyncHandler from "./async";

const jwtVerifyAsync = util.promisify(jwt.verify);

config();
export const checkUserToken = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.headers["x-access-token"]) {
      token = req.headers["x-access-token"];
    } else if (req.headers.token) {
      token = req.headers.token;
    }
    if (!token) return ResMsg(res, 401, "error", "unauthenticated.", null);
    const payload = await jwtVerifyAsync(token, process.env.JWT_PRIVATE_KEY);
    req.payload = payload;
    return next();
  } catch (error) {
    return ResMsg(res, 403, "error", error.message, error);
  }
};

export const verifyToken = asyncHandler(async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers["x-access-token"]) {
    token = req.headers["x-access-token"];
  } else if (req.headers.token) {
    token = req.headers.token;
  }
  if (!token) return ResMsg(res, 401, "error", "unauthenticated.", null);
  const userObject = await jwtVerifyAsync(token, process.env.JWT_PRIVATE_KEY);
  const user = await User.findById(userObject.id);

  // check user status
  if (user.status !== "active") {
    return ResMsg(
      res,
      403,
      "error",
      "Your account has been disabled, please contact us for support.",
      null
    );
  }

  req.user = userObject;
  return next();
});

export const verifyAdmin = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.headers["x-access-token"]) {
      token = req.headers["x-access-token"];
    } else if (req.headers.token) {
      token = req.headers.token;
    }
    if (!token) return ResMsg(res, 403, "error", "unauthenticated.", null);
    const adminObject = await jwtVerifyAsync(
      token,
      process.env.JWT_PRIVATE_KEY
    );
    const roles = ["admin", "super"];
    const admin = await Admin.findById(adminObject.id);

    if (!admin || admin.status !== "active")
      return ResMsg(
        res,
        403,
        "error",
        "Account inactive, Please contact administrator",
        null
      );

    if (!roles.includes(admin.role))
      return ResMsg(res, 403, "error", "unauthorized.", null);
    req.admin = adminObject;
    return next();
  } catch (error) {
    return ResMsg(res, 401, "error", error.message, error);
  }
};

export const verifySuper = async (req, res, next) => {
  try {
    const roles = ["super"];
    if (!roles.includes(req.admin.role))
      return ResMsg(res, 403, "error", "unauthorized.", null);
    return next();
  } catch (error) {
    return ResMsg(res, 401, "error", error.message, error);
  }
};
