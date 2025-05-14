// routes/webPageRoutes.js
const express = require('express');
const router = express.Router();
const transporter = require('../config/mailer');
const crypto = require('crypto');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');// adjust path if needed
const users = require('../models/users')(sequelize, DataTypes);


router.post('/getintouch', async (req, res) => {
  const { name, email, mobilenumber, message, countrycode } = req.body;

  const mailOptions = {
    from: "kolateja09@gmail.com",
    to: "maheshgaddala333@gmail.com",
    subject: `Contact Form Submission by ${name}`,
    html: `
      <html>
        <body style="font-family: Arial; background-color: #f4f4f4;">
          <div style="max-width:600px;margin:20px auto;padding:20px;background:#fff;border-radius:8px;">
            <h3 style="background:#4caf50;color:#fff;padding:10px;text-align:center;">Contact Form Submission</h3>
            <p>Hi Team,</p>
            <p>${name} is contacting us via the website form.</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Mobile Number:</strong> ${countrycode}${mobilenumber}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <p>Best regards,<br />The Assignment Linkers Team</p>
            <hr />
            <p style="font-size:12px;color:#777;text-align:center;">&copy; 2024 Assignment Linkers | 
              <a href="https://assignmentlinkers.com" style="color:#4caf50;">Visit Website</a>
            </p>
          </div>
        </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/reviews", async (req, res) => {
  const { name, phoneNumber, orderCode, comment, rating } = req.body;

  const mailOptions = {
    from: "kolateja09@gmail.com", // Replace with your email
    to: "maheshgaddala333@gmail.com", // Destination email
    subject: `Feedback Form Submission by ${name}`,
    html: `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Feedback Form Submission </title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
      <div style="background-color: #4caf50; color: #ffffff; padding: 10px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px">
        <h3>Feedback Form Submission</h3>
      </div>
      <div style="padding: 20px; color: #333333">
        <p>Hi Team,</p>
        <p>${name}, filled feedback form</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile Number:</strong>${phoneNumber}</p>
        <p><strong>Order Code:</strong>${orderCode}</p>
        <p><strong>Rating:</strong>${rating}</p>
        <p><strong>Comment:</strong></p>
        <p>${comment}</p>

        <p><strong>Best regards,</strong></p>
        <p>The Assignment Linkers Team</p>
      </div>
      <div style="padding: 10px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #dddddd">
        <p>&copy; 2024 Assignment Linkers. All rights reserved.</p>
        <p><a href="https://assignmentlinkers.com" style="color: #4caf50; text-decoration: none">Visit our website</a></p>
      </div>
    </div>
  </body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);

    // Send success response with JSON body
    res.status(200).json({ message: "Thank you for your valuable feedback" });
  } catch (error) {
    // Log error and send failure response
    console.error("Error processing the form submission:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


router.post("/quotationrequest", async (req, res) => {
  const { name, countrycode, mobilenumber, subject, email, deadline, wordcount, university, description } = req.body;

  // Set up email data
  const mailOptions = {
    from: "kolateja09@gmail.com", // Replace with your email
    to: "maheshgaddala333@gmail.com",
    subject: `Quotation request from ${name}`,
    html: `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quotation request </title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
      <div style="background-color: #4caf50; color: #ffffff; padding: 10px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px">
        <h3>Quotation request from ${name}</h3>
      </div>
      <div style="padding: 20px; color: #333333">
        <p>Hi Team,</p>
        <p>We have received a Quotation request from user. Here are the details:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>country code:</strong> ${countrycode}</p>
        <p><strong>Mobile Number:</strong>${mobilenumber}</p>
        <p><strong>Email:</strong>${email}</p>
        <p><strong>Subject:</strong>${subject}</p>
        <p><strong>wordcount:</strong>${wordcount}</p>
        <p><strong>Deadline:</strong>${deadline}</p>
        <p><strong>university:</strong>${university}</p>
        <p><strong>Description:</strong></p>
        <p>${description}</p>

        <p><strong>Best regards,</strong></p>
        <p>The Assignment Linkers Team</p>
      </div>
      <div style="padding: 10px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #dddddd">
        <p>&copy; 2024 Assignment Linkers. All rights reserved.</p>
        <p><a href="https://assignmentlinkers.com" style="color: #4caf50; text-decoration: none">Visit our website</a></p>
      </div>
    </div>
  </body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    // Log error and send failure response
    console.error("Error processing the form submission:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    const PORT = process.env.PORT || 3000;

    user.resetToken = token;
    user.resetTokenExpires = expires;
    await user.save();

    // const resetLink = `http://localhost:${PORT}/api/auth/reset-password?token=${token}`;
    const resetPasswordLink = `http://localhost:3001/reset-password`;


    const mailOptions = {
      from: "kolateja09@gmail.com", // Replace with your email
      to: user.email,
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetPasswordLink}">this</a> to reset your password.</p>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ message: 'Failed to send reset email' });
  }
});


module.exports = router;
