const express = require("express");
const ContactForm = require("../models/contactFormModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const router = express.Router();

const otpStore = new Map();

router.post("/add", async (req, res) => {
    try {
        const { name, email, phone, subject, message, otp } = req.body;

        // OTP validation
        const record = otpStore.get(email);
        if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        const newEntry = new ContactForm({ name, email, phone, subject, message });
        await newEntry.save();

        // Remove used OTP
        otpStore.delete(email);

        res.status(200).json({ message: "Form submitted successfully" });
    } catch (err) {
        console.error("Error saving contact form:", err);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

// GET /fetchAll - Get all contact form submissions
router.get("/fetchAll", async (req, res) => {
    try {
        const submissions = await ContactForm.find().sort({ createdAt: -1 }); // Latest first
        res.status(200).json(submissions);
    } catch (err) {
        console.error("Error fetching contact form data:", err);
        res.status(500).json({ error: "Server error while fetching data" });
    }
});

router.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
    }

    try {
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 5-min expiration
        otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

        // Send email using nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail", // or use SMTP config
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Contact Form" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP for Contact Form Submission",
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        });

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (err) {
        console.error("Error sending OTP:", err);
        res.status(500).json({ error: "Failed to send OTP" });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSubmission = await ContactForm.findByIdAndDelete(id);

        if (!deletedSubmission) {
            return res.status(404).json({ error: "Submission not found" });
        }

        res.status(200).json({ message: "Submission deleted successfully" });
    } catch (err) {
        console.error("Error deleting contact form submission:", err);
        res.status(500).json({ error: "Server error while deleting submission" });
    }
});

module.exports = router;
