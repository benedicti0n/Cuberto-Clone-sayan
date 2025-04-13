const mongoose = require('mongoose');

const headerLineSchema = new mongoose.Schema({
    headerLines: {
        type: [String],
        required: true,
        validate: [arr => arr.length === 4, 'Exactly 4 header lines are required.'],
    },
});

module.exports = mongoose.model('HeaderLine', headerLineSchema);
