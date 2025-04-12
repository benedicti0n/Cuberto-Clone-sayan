const mongoose = require("mongoose");

const taglineSchema = new mongoose.Schema({
    tagline: {
        type: String,
        default: "",
    },
}, {
    timestamps: true, // createdAt and updatedAt
});

const Tagline = mongoose.models.Tagline || mongoose.model("Tagline", taglineSchema);

module.exports = Tagline;
