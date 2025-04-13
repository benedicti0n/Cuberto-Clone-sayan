const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    data: {
        type: Buffer,
        required: true,
    },
    contentType: {
        type: String,
        default: 'application/pdf',
    },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
