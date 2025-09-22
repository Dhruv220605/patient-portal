const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    sex: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    allergies: { type: String },
    bloodGroup: { type: String, required: true },
    isDiabetic: { type: Boolean, required: true },
    hasThyroid: { type: Boolean, required: true },
    qrCode: { type: String },
    files: [{
        public_id: String,
        url: String,
        fileName: String,
        resource_type: String,
        uploadedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);