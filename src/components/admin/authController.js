import asyncHandler from "../../middleware/async";
import { EncryptPassword, ResMsg, verifyPassword } from "../../utils";
import { Admin } from "./models";

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) return ResMsg(res, 400, "error", "admin not found");

  if (admin.status !== "active")
    return ResMsg(
      res,
      401,
      "error",
      "Account inactive, Please contact administrator."
    );

  const match = await verifyPassword(password, admin.password);
  if (!match) return ResMsg(res, 400, "error", "invalid credentials");

  const token = admin.getSignedJwtToken();
  return ResMsg(res, 200, "success", "Login Success.", { admin, token });
});

export const createAdmin = asyncHandler(async (req, res) => {
  const { email, password, name, role } = req.body;
  const chkIfExist = await Admin.findOne({ email });
  if (chkIfExist)
    return ResMsg(res, 400, "error", "admin with that email already exists.");

  const hash = await EncryptPassword(password);
  const admin = await Admin.create({
    email,
    password: hash,
    name,
    role,
  });
  const token = admin.getSignedJwtToken();
  return ResMsg(res, 201, "success", "Admin created Success.", {
    admin,
    token,
  });
});

export const createSuperAdmin = asyncHandler(async (req, res) => {
  const name = "admin",
    email = process.env.ADMIN_USER || "admin@gmail.com",
    password = process.env.ADMIN_PASSWORD || "admin123",
    role = "super";

  const chkIfExist = await Admin.findOne({ email });
  if (chkIfExist)
    return ResMsg(res, 400, "error", "admin with that email already exists.");

  const hash = await EncryptPassword(password);
  const admin = await Admin.create({
    email,
    password: hash,
    name,
    role,
  });
  const token = admin.getSignedJwtToken();
  return ResMsg(res, 201, "success", "Admin created Success.", {
    admin,
    token,
  });
});

export const adminChangePassword = asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body;
  const admin = await Admin.findById(req.admin.id);
  if (!admin) return ResMsg(res, 401, "error", "invalid credentials");
  const match = await verifyPassword(password, admin.password);
  if (!match) return ResMsg(res, 401, "error", "invalid old password");

  const hash = await EncryptPassword(newPassword);
  admin.set({ password: hash });
  await admin.save();
  return ResMsg(res, 200, "success", "Password update Success.", null);
});
