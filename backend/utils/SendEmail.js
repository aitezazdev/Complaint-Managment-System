import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use service instead of host/port
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAccountCreatedEmail = async (to, name) => {
  const mailOptions = {
    from: `"CMC Support" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Welcome to Complaint Management System (CMC)",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to CMC 🎉</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your account has been successfully created on the 
        <b>Complaint Management System (CMC)</b>.</p>

        <p>You can now log in and start managing your complaints easily.</p>

        <p>If you did not create this account, please contact support immediately.</p>

        <hr/>
        <p style="font-size: 12px; color: gray;">
          This is an automated message. Please do not reply.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
