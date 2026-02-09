import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Existing function
export const sendAccountCreatedEmail = async (to, name) => {
  const mailOptions = {
    from: `"CMC Support" <${process.env.EMAIL_USER}>`,
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

// Send email when complaint is created
export const sendComplaintCreatedEmail = async (to, name, complaintData) => {
  const mailOptions = {
    from: `"CMC Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Complaint Submitted Successfully - CMC",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #4CAF50;">✅ Complaint Submitted Successfully</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your complaint has been successfully submitted to our system.</p>

        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Complaint Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">Title:</td>
              <td style="padding: 8px 0;">${complaintData.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Category:</td>
              <td style="padding: 8px 0;">${complaintData.category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Priority:</td>
              <td style="padding: 8px 0;">${complaintData.priority}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Status:</td>
              <td style="padding: 8px 0;"><span style="background-color: #FFA500; color: white; padding: 3px 10px; border-radius: 3px;">${complaintData.status}</span></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Address:</td>
              <td style="padding: 8px 0;">${complaintData.address}</td>
            </tr>
          </table>
        </div>

        <p>We will review your complaint and update you on its status soon.</p>
        <p>You can track your complaint status by logging into your account.</p>

        <hr/>
        <p style="font-size: 12px; color: gray;">
          This is an automated message. Please do not reply.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send email when complaint status is updated to "Resolved"
export const sendComplaintResolvedEmail = async (to, name, complaintData, adminNotes) => {
  const mailOptions = {
    from: `"CMC Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Complaint Has Been Resolved - CMC",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #4CAF50;">✅ Complaint Resolved</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Great news! Your complaint has been successfully resolved.</p>

        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Complaint Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">Title:</td>
              <td style="padding: 8px 0;">${complaintData.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Category:</td>
              <td style="padding: 8px 0;">${complaintData.category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Status:</td>
              <td style="padding: 8px 0;"><span style="background-color: #4CAF50; color: white; padding: 3px 10px; border-radius: 3px;">Resolved</span></td>
            </tr>
            ${adminNotes ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Admin Notes:</td>
              <td style="padding: 8px 0;">${adminNotes}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <p>Thank you for your patience. If you have any further concerns, feel free to submit a new complaint.</p>

        <hr/>
        <p style="font-size: 12px; color: gray;">
          This is an automated message. Please do not reply.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send email when complaint is rejected
export const sendComplaintRejectedEmail = async (to, name, complaintData, adminNotes) => {
  const mailOptions = {
    from: `"CMC Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Complaint Status Update - CMC",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #f44336;">❌ Complaint Rejected</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>We regret to inform you that your complaint has been reviewed and rejected.</p>

        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Complaint Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">Title:</td>
              <td style="padding: 8px 0;">${complaintData.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Category:</td>
              <td style="padding: 8px 0;">${complaintData.category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Status:</td>
              <td style="padding: 8px 0;"><span style="background-color: #f44336; color: white; padding: 3px 10px; border-radius: 3px;">Rejected</span></td>
            </tr>
            ${adminNotes ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Reason:</td>
              <td style="padding: 8px 0;">${adminNotes}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <p>If you believe this decision was made in error or you have additional information, please contact our support team.</p>

        <hr/>
        <p style="font-size: 12px; color: gray;">
          This is an automated message. Please do not reply.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send email when complaint is in progress
export const sendComplaintInProgressEmail = async (to, name, complaintData, adminNotes) => {
  const mailOptions = {
    from: `"CMC Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Complaint Status Update - In Progress - CMC",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #2196F3;">🔄 Complaint In Progress</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your complaint is now being actively worked on by our team.</p>

        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Complaint Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">Title:</td>
              <td style="padding: 8px 0;">${complaintData.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Category:</td>
              <td style="padding: 8px 0;">${complaintData.category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Status:</td>
              <td style="padding: 8px 0;"><span style="background-color: #2196F3; color: white; padding: 3px 10px; border-radius: 3px;">In Progress</span></td>
            </tr>
            ${adminNotes ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Update:</td>
              <td style="padding: 8px 0;">${adminNotes}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <p>We are working on resolving your issue. You will be notified once it is resolved.</p>

        <hr/>
        <p style="font-size: 12px; color: gray;">
          This is an automated message. Please do not reply.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};