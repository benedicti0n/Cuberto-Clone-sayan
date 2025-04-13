// models/About.js
const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema(
    {
        aboutText: {
            type: String,
            required: true,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('About', AboutSchema);
