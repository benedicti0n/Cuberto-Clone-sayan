// controllers/expertise.controller.js
const Expertise = require('../models/Expertise');

exports.addExpertise = async (req, res) => {
    try {
        const { title, description, icon, backgroundImage, proficiencyLevel, learnMoreLink } = req.body;

        const newExpertise = new Expertise({
            title,
            description,
            icon,
            backgroundImage,
            proficiencyLevel,
            learnMoreLink
        });

        await newExpertise.save();
        res.status(201).json({
            message: 'Expertise added successfully',
            expertise: newExpertise
        });
    } catch (error) {
        console.error('Error adding expertise:', error);
        res.status(500).json({
            message: 'Failed to add expertise',
            error: error.message
        });
    }
};

exports.getAllExpertise = async (req, res) => {
    try {
        const expertiseList = await Expertise.find().sort({ createdAt: -1 });
        res.status(200).json(expertiseList);
    } catch (error) {
        console.error('Error fetching expertise:', error);
        res.status(500).json({ message: 'Failed to fetch expertise', error });
    }
};

exports.deleteExpertise = async (req, res) => {
    try {
        const { id } = req.params;
        await Expertise.findByIdAndDelete(id);
        res.status(200).json({ message: 'Expertise deleted successfully' });
    } catch (error) {
        console.error('Error deleting expertise:', error);
        res.status(500).json({ message: 'Failed to delete expertise', error });
    }
};

exports.updateExpertise = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Expertise.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updated) return res.status(404).json({ message: 'Expertise not found' });

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating expertise', error: err.message });
    }
};