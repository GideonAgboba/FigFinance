import Log from "../utils/logger";

const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    // secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const message = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
      Log("email", JSON.stringify(err), err.response);
    } else {
      console(info);
    }
  });
};

export default sendEmail;
