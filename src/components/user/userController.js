/* eslint-disable import/prefer-default-export */
import asyncHandler from "../../middleware/async";
import { EncryptPassword, ResMsg, verifyPassword } from "../../utils";
import User from "./userModel";

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name,
      phone,
    },
    { new: true }
  ).populate({
    path: "event",
    populate: {
      path: "categoryId",
    },
  });
  if (!user) return ResMsg(res, 404, "error", "user not found");

  return ResMsg(res, 200, "success", "User profile update success.", user);
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "event",
    populate: {
      path: "categoryId",
    },
  });
  if (!user) return ResMsg(res, 404, "error", "user not found");

  return ResMsg(res, 200, "success", "User profile fetch success.", user);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPwd, newPwd } = req.body;
  const user = await User.findOne({ email: req.user.email });
  if (!user) return ResMsg(res, 404, "error", "user not found");
  const passwordCorrect = await verifyPassword(oldPwd, user.password);

  if (!passwordCorrect)
    return ResMsg(res, 400, "error", "Old password not correct.", null);

  const hash = await EncryptPassword(newPwd);
  user.set({ password: hash });

  await user.save();

  return ResMsg(res, 200, "success", "Password Change success", null);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, name } = req.query;
  const query = {
    $and: [
      {
        name: {
          $regex: name || "",
          $options: "i",
        },
      },
    ],
  };
  const results = await User.find(query)
    .populate({
      path: "event",
      populate: {
        path: "categoryId",
      },
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await User.find(query).countDocuments();
  return ResMsg(res, 200, "success", "All Users", {
    results,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  });
});
