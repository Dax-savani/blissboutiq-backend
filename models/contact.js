const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: {
        day: { type: Number, min: 1, max: 31 },
        month: { type: Number, min: 1, max: 12 },
        year: { type: Number, min: 1900, max: new Date().getFullYear() }
    },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
