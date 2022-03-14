import express from "express";
import { verifyAdmin } from "../../middleware/auth";
import { createContact } from "./contactController";

const Router = express.Router();

Router.post("/create", createContact);

export default Router;
