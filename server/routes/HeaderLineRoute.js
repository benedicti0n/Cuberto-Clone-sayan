const express = require('express');
const router = express.Router();
const HeaderLine = require('../models/HeaderLine'); // Make sure this is correct

// GET /getHeaderLine
router.get('/getHeaderLine', async (req, res) => {
    try {
        let data = await HeaderLine.findOne();

        // If no document exists, create one with 4 empty lines
        if (!data) {
            data = await HeaderLine.create({ headerLines: ['', '', '', ''] });
        }

        res.status(200).json({ headerLines: data.headerLines });
    } catch (error) {
        console.error('Error fetching header lines:', error.message);
        res.status(500).json({ message: 'Failed to fetch header lines.' });
    }
});

// POST /editHeaderLine
router.post('/editHeaderLine', async (req, res) => {
    try {
        const { headerLines } = req.body;
        console.log('Incoming body:', req.body);

        if (!Array.isArray(headerLines) || headerLines.length !== 4) {
            return res.status(400).json({ message: 'Exactly 4 header lines are required.' });
        }

        let doc = await HeaderLine.findOne();

        if (!doc) {
            doc = new HeaderLine({ headerLines });
        } else {
            doc.headerLines = headerLines;
        }

        await doc.save();

        res.status(200).json({ message: 'Header lines updated successfully.' });
    } catch (error) {
        console.error('Error updating header lines:', error);
        res.status(500).json({ message: 'Failed to update header lines.' });
    }
});

module.exports = router;
