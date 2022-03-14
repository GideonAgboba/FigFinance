/* eslint-disable import/prefer-default-export */

import express from "express";
import AdminRoutes from "./admin/adminRoutes";
import AuthRoutes from "./auth/authRoutes";
import eventRouter from "./event/eventRouter";
import subscribeRouter from "./subscribe/subscribeRouter";
import contactRouter from "./contact/contactRouter";
import userRoutes from "./user/userRoutes";

const router = express.Router();

const getFolderName = async (req, res, next) => {
  req.folderName = req.url.split("/")[1];
  return next();
};

router.use("/auth", AuthRoutes);
router.use("/user", userRoutes);
router.use("/admin", AdminRoutes);

router.use(getFolderName);

router.use("/event", eventRouter);
router.use("/subscribe", subscribeRouter);
router.use("/contact", contactRouter);

export default router;
