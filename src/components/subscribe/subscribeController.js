import asyncHandler from "../../middleware/async";
import { ResMsg } from "../../utils";
import Subscribe from "./subscribeModel";

export const getSubscribes = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1 } = req.query;

  const results = await Subscribe.find({})
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await Subscribe.find({}).countDocuments();
  return ResMsg(res, 200, "success", "Subscribes.", {
    results,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  });
});

export const createSubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const subscribe = await Subscribe.create({
    email,
  });
  ResMsg(res, 201, "success", "Subscribe created Success", subscribe);
});

export const deleteSubscribe = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const subscribe = await Subscribe.findByIdAndDelete(id);

  if (!subscribe) return ResMsg(res, 404, "error", "subscribe not found", null);
  return ResMsg(res, 200, "success", "Subscribe deleted Success", null);
});
