const mongoose = require('mongoose');

const ExpertiseSchema = new mongoose.Schema({
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
        required: true
    },
    proficiencyLevel: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    learnMoreLink: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Expertise', ExpertiseSchema);
