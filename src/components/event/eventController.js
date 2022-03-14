import asyncHandler from "../../middleware/async";
import { ResMsg } from "../../utils";
import Event from "./eventModel";
import EventCategory from "./eventCategory";

export const getEvents = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1 } = req.query;

  const results = await Event.find({})
    .sort({ createdAt: -1 })
    .populate("adminId", "name email _id")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await Event.find({}).countDocuments();
  return ResMsg(res, 200, "success", "Events.", {
    results,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  });
});

export const getNearByEvents = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;
  const results = await Event.find({
    address: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [Number(lng), Number(lat)],
        },
        $maxDistance: 20000,
        $minDistance: 0,
      },
    },
  });

  return ResMsg(res, 200, "success", "Nearby events.", results);
});

export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, categoryId, lng, lat, isVirtual } = req.body;
  const event = await Event.create({
    adminId: req.admin.id,
    title,
    description,
    categoryId,
    address: {
      coordinates: [Number(lng), Number(lat)],
    },
    isVirtual,
  });
  ResMsg(res, 201, "success", "Event created successfully", event);
});

export const updateEvent = asyncHandler(async (req, res) => {
  let { _id, title, description, categoryId, lng, lat, isVirtual } = req.body;

  const event = await Event.findByIdAndUpdate(
    _id,
    {
      ...req.body,
      title,
      description,
      categoryId,
      address: {
        coordinates: [Number(lng), Number(lat)],
      },
      isVirtual,
    },
    { new: true }
  );

  if (!event) return ResMsg(res, 404, "error", "event not found", null);

  return ResMsg(res, 200, "success", "Event updated successfully", event);
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findByIdAndDelete(id);

  if (!event) return ResMsg(res, 404, "error", "event not found", null);
  return ResMsg(res, 200, "success", "Event deleted successfully", null);
});

export const getEventCategories = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1 } = req.query;

  const results = await EventCategory.find({})
    .sort({ createdAt: -1 })
    .populate("adminId", "name email _id")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await EventCategory.find({}).countDocuments();
  return ResMsg(res, 200, "success", "Event categories.", {
    results,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  });
});

export const createEventCategory = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const event = await EventCategory.create({
    adminId: req.admin.id,
    title,
    description,
  });
  ResMsg(res, 201, "success", "Event category created successfully", event);
});

export const updateEventCategory = asyncHandler(async (req, res) => {
  let { _id, title, description } = req.body;

  const event = await EventCategory.findByIdAndUpdate(
    _id,
    {
      ...req.body,
      title,
      description,
    },
    { new: true }
  );

  if (!event) return ResMsg(res, 404, "error", "event not found", null);

  return ResMsg(
    res,
    200,
    "success",
    "Event category updated successfully",
    event
  );
});

export const deleteEventCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await EventCategory.findByIdAndDelete(id);

  if (!event) return ResMsg(res, 404, "error", "event not found", null);
  return ResMsg(
    res,
    200,
    "success",
    "EventCategory deleted successfully",
    null
  );
});
