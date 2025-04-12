const express = require('express');
const router = express.Router();
const multer = require('multer');
const Resume = require('../models/ResumeModel');

// Setup multer (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route   POST /resume/addResume
// @desc    Upload resume PDF
router.post('/addResume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file || req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'Only PDF files are allowed.' });
        }

        // Remove existing resume
        await Resume.deleteMany({});

        // Save new resume
        const newResume = new Resume({
            data: req.file.buffer,
            contentType: req.file.mimetype,
        });
        await newResume.save();

        res.json({ message: 'Resume uploaded successfully.' });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Failed to upload resume.' });
    }
});

// @route   GET /resume/getResume
// @desc    Get the resume PDF
router.get('/getResume', async (req, res) => {
    try {
        const resume = await Resume.findOne().sort({ createdAt: -1 });
        if (!resume) {
            return res.status(404).json({ error: 'No resume found.' });
        }

        res.contentType(resume.contentType);
        res.send(resume.data);
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch resume.' });
    }
});

// @route   DELETE /resume/deleteResume
// @desc    Delete the resume
router.delete('/deleteResume', async (req, res) => {
    try {
        await Resume.deleteMany({});
        res.json({ message: 'Resume deleted successfully.' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Failed to delete resume.' });
    }
});

module.exports = router;
