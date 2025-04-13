const HeaderLine = require('../models/Expertise');

const getHeaderLine = async (req, res) => {
    try {
        let data = await HeaderLine.findOne();

        // If no document exists, create one with exactly 4 lines
        if (!data) {
            data = await HeaderLine.create({ headerLines: ['', '', '', ''] }); // <-- Fix here
        }

        res.status(200).json({ headerLines: data.headerLines });
    } catch (error) {
        console.error('Error fetching header lines:', error.message);
        res.status(500).json({ message: 'Failed to fetch header lines.' });
    }
};

const editHeaderLine = async (req, res) => {
    try {
        console.log("Incoming body:", req.body); // 🔍 Debug

        const { headerLines } = req.body;

        if (!Array.isArray(headerLines)) {
            return res.status(400).json({ message: 'Invalid headerLines format.' });
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
};

module.exports = editHeaderLine;
module.exports = getHeaderLine;