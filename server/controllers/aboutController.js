// controllers/aboutController.js
const About = require('../models/About');

exports.fetchAbout = async (req, res) => {
    try {
        let about = await About.findOne();

        // If none exists, initialize with empty one
        if (!about) {
            about = await About.create({ aboutText: '' });
        }

        res.json({ aboutText: about.aboutText });
    } catch (err) {
        console.error('Error fetching about text:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.saveAbout = async (req, res) => {
    try {
        const { aboutText } = req.body;

        if (typeof aboutText !== 'string') {
            return res.status(400).json({ error: 'Invalid input' });
        }

        let about = await About.findOne();

        if (!about) {
            await About.create({ aboutText });
        } else {
            about.aboutText = aboutText;
            await about.save();
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error saving about text:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
