const mongoose = require('mongoose');

const expertiseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    backgroundImage: {
        type: String,
        required: false
    },
    imageData: {
        type: Buffer,
        required: false
    },
    proficiencyLevel: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    learnMoreLink: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Expertise', expertiseSchema);
