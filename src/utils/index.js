/* eslint-disable no-plusplus */
import crypto from "crypto";

/**
 * Send Response
 * @param {object} res express response Object
 * @param {number} statusCode HTTP status code
 * @param {string} status Status type ('success'||''error')
 * @param {string} message info to the user
 * @param {object} data object of data for user
 */
export const ResMsg = (res, statusCode = 200, status, message, data = null) => {
  res.status(statusCode).json({
    status,
    message,
    data,
  });
};

/**
 * EncryptPassword
 * @param {string} password String to be encrypted
 */
export const EncryptPassword = async (password) =>
  new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(8).toString("hex");

    crypto.scrypt(password, salt, 64, (err, hashPassword) => {
      if (err) reject(err);
      resolve(`${salt}:${hashPassword.toString("hex")}`);
    });
  });

/**
 * Compare Password
 * @param {string} password input string by user
 * @param {string} hash saved hashed password
 * @returns {boolean} true if password match hash and otherwise
 */
export const verifyPassword = (password, hash) =>
  new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString("hex"));
    });
  });

export const generateOTP = () => {
  // Declare a digits variable
  // which stores all digits
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export const getExpiryTime = (minutes) => {
  const currentDate = new Date();
  const expiry = new Date(currentDate.getTime() + minutes * 60000);
  return expiry;
};
