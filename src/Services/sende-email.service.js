import nodemailer from "nodemailer";
import { EventEmitter } from "events";
export const sendEmailService = async ({
  to,
  subject,
  html,
  attachments = [],
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: `"NO-REPLY"<${process.env.EMAIL_USER}>`, // sender address
      to,
      subject,
      html,
      attachments,
    });
    return info;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "server error try later",
    });
  }
};
export const emitter = new EventEmitter();
emitter.on("sendEmail", (...args) => {
  console.log(args);
  const { to, subject, html, attachments } = args[0];
  sendEmailService({
    to,
    subject,
    html,
    attachments,
  });
  console.log("email sent");
});
