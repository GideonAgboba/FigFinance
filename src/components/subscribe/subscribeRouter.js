import express from "express";
import { verifyAdmin } from "../../middleware/auth";
import { createSubscribe, deleteSubscribe } from "./subscribeController";

const Router = express.Router();

Router.post("/create", createSubscribe);
Router.post("/delete", verifyAdmin, deleteSubscribe);

export default Router;
