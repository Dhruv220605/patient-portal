const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/me', auth, async (req, res) => {
    try {
        if (req.user.role !== 'patient') return res.status(403).json({ msg: 'Access denied' });
        const patient = await Patient.findById(req.user.id).select('-password');
        res.json(patient);
    } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') return res.status(403).json({ msg: 'Access denied' });
        const patients = await Patient.find().select('-password');
        res.json(patients);
    } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') return res.status(403).json({ msg: 'Access denied' });
        const patient = await Patient.findById(req.params.id).select('-password');
        if (!patient) return res.status(404).json({ msg: 'Patient not found' });
        res.json(patient);
    } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/:id/upload', [auth, upload.single('file')], async (req, res) => {
    if (req.user.role !== 'doctor') return res.status(403).json({ msg: 'Access denied' });
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ msg: 'Patient not found' });
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

        const uploadOptions = {
            folder: `patient_records/${patient._id}`,
            resource_type: req.file.mimetype === 'application/pdf' ? 'raw' : 'auto',
        };

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const newFile = {
            public_id: result.public_id,
            url: result.secure_url,
            fileName: req.file.originalname,
            resource_type: result.resource_type
        };
        patient.files.unshift(newFile);
        await patient.save();
        res.json(patient);
    } catch (err) {
        console.error('File upload error:', err);
        res.status(500).send('Server Error');
    }
});

router.delete('/:patientId/files/:fileId', auth, async (req, res) => {
    if (req.user.role !== 'doctor') return res.status(403).json({ msg: 'Access denied' });
    try {
        const patient = await Patient.findById(req.params.patientId);
        if (!patient) return res.status(404).json({ msg: 'Patient not found' });
        const fileToDelete = patient.files.find(file => file._id.toString() === req.params.fileId);
        if (!fileToDelete) return res.status(404).json({ msg: 'File not found' });
        
        await cloudinary.uploader.destroy(fileToDelete.public_id, { resource_type: fileToDelete.resource_type || 'raw' });
        patient.files = patient.files.filter(file => file._id.toString() !== req.params.fileId);
        await patient.save();
        res.json(patient.files);
    } catch (err) {
        console.error('File deletion error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;