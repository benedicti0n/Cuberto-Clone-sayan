const mongoose = require("mongoose");

const contactFormSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            match: [/^[0-9]{10}$/, "Phone must be a valid 10-digit number"],
        },
        subject: {
            type: String,
            required: [true, "Subject is required"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const ContactForm = mongoose.models.ContactForm || mongoose.model("ContactForm", contactFormSchema);

module.exports = ContactForm;
