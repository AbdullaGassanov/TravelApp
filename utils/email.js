import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';

configDotenv();

const sendEmail = async (options) => {
  // 1) Create transporter

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },

    // ACTIVATE in gmail "less secure app" otion
  });

  // 2) Define the email options

  const mailOptions = {
    from: 'New Gen <newgen@natours.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
