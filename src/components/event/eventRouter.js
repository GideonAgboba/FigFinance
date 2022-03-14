import express from "express";
import { verifyAdmin } from "../../middleware/auth";
import {
  createEvent,
  createEventCategory,
  deleteEvent,
  deleteEventCategory,
  getEventCategories,
  getEvents,
  getNearByEvents,
  updateEvent,
  updateEventCategory,
} from "./eventController";

const Router = express.Router();

Router.get("/", getEvents);
Router.get("/nearby", getNearByEvents);
Router.post("/create", verifyAdmin, createEvent);
Router.post("/update", verifyAdmin, updateEvent);
Router.delete("/:id", verifyAdmin, deleteEvent);

Router.get("/category", getEventCategories);
Router.post("/category/create", verifyAdmin, createEventCategory);
Router.post("/category/update", verifyAdmin, updateEventCategory);
Router.delete("/category/:id", verifyAdmin, deleteEventCategory);

export default Router;
