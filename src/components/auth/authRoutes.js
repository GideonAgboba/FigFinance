import express from "express";

import { forgotPassword, login, logOut, resetPassword, signUp } from ".";
import { resetPwdValidation, validate } from "../../helpers/validation";
import { verifyAdmin } from "../../middleware/auth";

import {
  adminChangePassword,
  adminLogin,
  createSuperAdmin,
} from "../admin/authController";

const Router = express.Router();

Router.post("/signup", signUp);
Router.post("/login", login);
Router.post("/logout", logOut);
Router.post("/forgotPwd", forgotPassword);
Router.post("/resetPwd", resetPwdValidation(), validate, resetPassword);

Router.post("/admin/init", createSuperAdmin);
Router.post("/admin/login", adminLogin);
Router.patch("/admin/change-password", verifyAdmin, adminChangePassword);

export default Router;
