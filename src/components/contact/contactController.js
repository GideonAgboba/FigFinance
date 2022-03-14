import asyncHandler from "../../middleware/async";
import { ResMsg } from "../../utils";
import Contact from "./contactModel";

export const getContacts = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1 } = req.query;

  const results = await Contact.find({})
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await Contact.find({}).countDocuments();
  return ResMsg(res, 200, "success", "Contacts.", {
    results,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  });
});

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });
  ResMsg(res, 201, "success", "Contact created Success", contact);
});

export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) return ResMsg(res, 404, "error", "contact not found", null);
  return ResMsg(res, 200, "success", "Contact deleted Success", null);
});
