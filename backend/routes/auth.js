const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const qrcode = require('qrcode');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const router = express.Router();

router.post('/register/patient', async (req, res) => {
    const { name, surname, email, phoneNumber, password, dateOfBirth, sex, allergies, bloodGroup, isDiabetic, hasThyroid } = req.body;
    try {
        let patient = await Patient.findOne({ email });
        if (patient) return res.status(400).json({ msg: 'Patient with this email already exists' });

        patient = new Patient({ 
            name, surname, email, phoneNumber, password, dateOfBirth, sex, allergies, bloodGroup, isDiabetic, hasThyroid
        });
        
        // --- START OF DEBUGGING LOGS ---
        console.log("--- QR CODE GENERATION DEBUG ---");
        console.log("Reading FRONTEND_URL from environment variable...");
        
        // This line reads the variable from Render's settings.
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        
        console.log("Value found for process.env.FRONTEND_URL:", process.env.FRONTEND_URL);
        console.log("URL that will be used for QR Code:", frontendUrl);
        
        const patientProfileUrl = `${frontendUrl}/patient-profile/${patient._id}`;
        
        console.log("Final URL being converted to QR Code:", patientProfileUrl);
        console.log("------------------------------------");
        // --- END OF DEBUGGING LOGS ---

        const qrCodeDataUrl = await qrcode.toDataURL(patientProfileUrl);
        patient.qrCode = qrCodeDataUrl;

        const salt = await bcrypt.genSalt(10);
        patient.password = await bcrypt.hash(password, salt);
        await patient.save();

        const payload = { user: { id: patient.id, role: 'patient' } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Login routes are unchanged ---
router.post('/login/patient', async (req, res) => {
    const { email, password } = req.body;
    try {
        let patient = await Patient.findOne({ email });
        if (!patient) return res.status(400).json({ msg: 'Invalid Credentials' });
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
        const payload = { user: { id: patient.id, role: 'patient' } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) { console.error(err.message); res.status(500).send('Server error'); }
});
router.post('/login/doctor', async (req, res) => {
    const { username, password } = req.body;
    try {
        let doctor = await Doctor.findOne({ username });
        if (!doctor) return res.status(400).json({ msg: 'Invalid Credentials' });
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
        const payload = { user: { id: doctor.id, role: 'doctor' } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) { console.error(err.message); res.status(500).send('Server error'); }
});

module.exports = router;