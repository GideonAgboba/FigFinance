/* eslint-disable import/prefer-default-export */

import asyncHandler from "../../middleware/async";
import { ResMsg } from "../../utils";
import Event from "../event/eventModel";
import User from "../user/userModel";
import Subscribe from "../subscribe/subscribeModel";

export const analytics = asyncHandler(async (req, res) => {
  const eventCount = await Event.find({}).countDocuments();
  const userCount = await User.find({}).countDocuments();
  const subscriberCount = await Subscribe.find({}).countDocuments();

  return ResMsg(res, 200, "success", "Analytics.", {
    eventTotal: eventCount,
    userTotal: userCount,
    subscriberTotal: subscriberCount,
  });
});

export const toggleUsers = asyncHandler(async (req, res) => {
  const { userId, status } = req.body;
  const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
  if (!user) return ResMsg(res, 404, "error", "User not found.", user);
  return ResMsg(res, 200, "success", `User is now ${status}.`, user);
});
