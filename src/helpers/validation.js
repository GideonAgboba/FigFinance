import { body, validationResult } from "express-validator";
import { ResMsg } from "../utils";

export const resetPwdValidation = () => [
  body("newPwd").not().isEmpty().withMessage("newPwd is required"),
  body("email").not().isEmpty().withMessage("email is required"),
  body("otp").not().isEmpty().withMessage("otp is required"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  return ResMsg(res, 422, "error", "invalid input", extractedErrors);
};
