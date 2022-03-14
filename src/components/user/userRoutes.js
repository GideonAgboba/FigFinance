import express from "express";
import { verifyToken } from "../../middleware/auth";
import {
  changePassword,
  getUserProfile,
  updateProfile,
} from "./userController";

const Router = express.Router();

Router.put("/profile", verifyToken, updateProfile);
Router.get("/profile", verifyToken, getUserProfile);

Router.patch("/change-password", verifyToken, changePassword);

export default Router;
