const express = require("express");
const ContactForm = require("../models/contactFormModel");

const router = express.Router();

router.post("/add", async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const newEntry = new ContactForm({ name, email, phone, subject, message });
        await newEntry.save();

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


module.exports = router;
