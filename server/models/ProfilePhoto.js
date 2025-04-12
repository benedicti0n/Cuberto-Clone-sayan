const mongoose = require('mongoose')

const ProfilePhotoSchema = new mongoose.Schema(
    {
        photo: {
            type: Buffer,
            required: true,
        },
        contentType: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports =
    mongoose.models.ProfilePhoto || mongoose.model('ProfilePhoto', ProfilePhotoSchema)
