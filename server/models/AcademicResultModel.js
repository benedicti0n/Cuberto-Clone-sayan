const mongoose = require('mongoose')

const academicResultSchema = new mongoose.Schema({
    title: { type: String, required: true },
    file: {
        type: {
            data: Buffer,
            contentType: String
        },
        required: true
    }
})

module.exports = mongoose.model('AcademicResult', academicResultSchema)
