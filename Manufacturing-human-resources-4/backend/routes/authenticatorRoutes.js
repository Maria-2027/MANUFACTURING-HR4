import express from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";

const router = express.Router();

// Temporary storage for 2FA codes (use a database in production)
const twoFACodes = {};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email from .env
      pass: process.env.EMAIL_PASS, // Your email password or app password from .env
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  });

// Route to send 2FA code
router.post("/send-2fa-code", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Generate a random 6-digit code
  const code = crypto.randomInt(100000, 999999).toString();

  // Store the code temporarily (use a database in production)
  twoFACodes[email] = { code, expiresAt: Date.now() + 5 * 60 * 1000 }; // Code expires in 5 minutes

  // Send the code via email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your 2FA Verification Code",
    text: `Magandang Araw Ka-JJM, Ang iyong Verification Code ay ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send verification code" });
  }
});

// Route to verify 2FA code
router.post("/verify-2fa-code", (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  const storedCode = twoFACodes[email];

  if (!storedCode) {
    return res.status(400).json({ error: "No code found for this email" });
  }

  if (storedCode.expiresAt < Date.now()) {
    return res.status(400).json({ error: "Code has expired" });
  }

  if (storedCode.code !== code) {
    return res.status(400).json({ error: "Invalid code" });
  }

  // Code is valid, delete it from storage
  delete twoFACodes[email];

  res.status(200).json({ message: "2FA verification successful" });
});

export default router;
