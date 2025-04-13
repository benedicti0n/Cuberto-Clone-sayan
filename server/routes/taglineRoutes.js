const express = require("express");
const router = express.Router();
const Tagline = require("../models/taglineModel");

// GET: Fetch tagline
router.get("/fetchTagline", async (req, res) => {
    try {
        const taglineDoc = await Tagline.findOne().sort({ updatedAt: -1 });
        res.status(200).json({ tagline: taglineDoc?.tagline || "" });
    } catch (error) {
        console.error("Error fetching tagline:", error);
        res.status(500).json({ error: "Failed to fetch tagline" });
    }
});

// POST: Add or update tagline
router.post("/addTagline", async (req, res) => {
    try {
        const { tagline } = req.body;

        let existing = await Tagline.findOne();
        if (existing) {
            existing.tagline = tagline;
            await existing.save();
        } else {
            await Tagline.create({ tagline });
        }

        res.status(200).json({ message: "Tagline saved successfully" });
    } catch (error) {
        console.error("Error saving tagline:", error);
        res.status(500).json({ error: "Failed to save tagline" });
    }
});

module.exports = router;
