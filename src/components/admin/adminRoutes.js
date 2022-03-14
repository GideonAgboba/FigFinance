import express from "express";
import { verifyAdmin, verifySuper } from "../../middleware/auth";
import { getContacts } from "../contact/contactController";
import { getEventCategories, getEvents } from "../event/eventController";
import { getSubscribes } from "../subscribe/subscribeController";
import { getAllUsers } from "../user/userController";
import { analytics, toggleUsers } from "./adminController";
import { createAdmin } from "./authController";

const Router = express.Router();

Router.post("/create", verifyAdmin, verifySuper, createAdmin);
Router.get("/analytics", verifyAdmin, analytics);

Router.get("/get-events", verifyAdmin, getEvents);
Router.get("/get-events-categories", verifyAdmin, getEventCategories);
Router.get("/all-users", verifyAdmin, getAllUsers);
Router.get("/get-subscribers", verifyAdmin, getSubscribes);
Router.get("/get-contacts", verifyAdmin, getContacts);
Router.put("/toggle-user", verifyAdmin, toggleUsers);

export default Router;
