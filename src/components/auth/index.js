/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */

import { signupMessage, forgotPwdMessage } from "../../email";
import sendEmail from "../../email/emailConfig";
import asyncHandler from "../../middleware/async";
import {
  EncryptPassword,
  generateOTP,
  getExpiryTime,
  ResMsg,
  verifyPassword,
} from "../../utils";
import OTP from "../user/OTPModel";
import User from "../user/userModel";

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const chk = await User.findOne({ email: email.toLowerCase() });
  if (chk) return ResMsg(res, 400, "error", "user already exist", null);

  const encryptPwd = await EncryptPassword(password);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: encryptPwd,
    phone,
  });
  const token = await user.getSignedJwtToken();
  sendEmail({
    email,
    subject: "Welcome to figfinance!",
    message: signupMessage(),
  });

  return ResMsg(res, 201, "success", "Signup success.", { user, token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).populate({
    path: "event",
    populate: {
      path: "eventId",
    },
  });
  if (!user) return ResMsg(res, 404, "error", "Invalid email/password.");
  if (user.status !== "active")
    return ResMsg(
      res,
      403,
      "error",
      "Your account has been disabled, please contact us for support.",
      null
    );

  const passwordCorrect = await verifyPassword(password, user.password);
  if (!passwordCorrect)
    return ResMsg(res, 400, "error", "Invalid email/password.", null);

  const token = await user.getSignedJwtToken();

  return ResMsg(res, 200, "success", "User login success.", { user, token });
});

export const logOut = asyncHandler(async (req, res) => {
  return ResMsg(res, 200, "success", "Logout success.", {});
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return ResMsg(res, 422, "error", "email is required.", null);
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return ResMsg(res, 400, "error", "email does not exist.", null);
  const otp = generateOTP();

  const expiry = getExpiryTime(20);
  await OTP.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), otp, expiry },
    { upsert: true }
  );
  sendEmail({
    email,
    subject: "Password reset for figfinance",
    message: forgotPwdMessage(otp),
  });

  return ResMsg(res, 200, "success", "Verification code sent to email.", null);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPwd } = req.body;
  const verifyOtp = await OTP.findOne({
    email: email.toLowerCase(),
    otp: String(otp),
  });
  if (!verifyOtp) return ResMsg(res, 400, "error", "invalid OTP.", null);
  if (new Date() > new Date(verifyOtp.expiry))
    return ResMsg(res, 400, "error", "OTP expired.", null);

  const hash = await EncryptPassword(newPwd);
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { password: hash }
  );

  return ResMsg(res, 200, "success", "Password reset successful.", null);
});
