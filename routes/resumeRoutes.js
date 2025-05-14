const express = require('express');
const router = express.Router();
const resumesController = require('../controllers/resumesController');
const multer = require('multer');
const path = require('path');

// Multer configuration for file upload
const imageconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads/resumes');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: imageconfig,
    limits: { fileSize: 1000000000 }
});

// Routes
router.post('/', upload.single('file'), resumesController.createResume); // Corrected order
router.get('/', resumesController.getAllResumes);
router.get('/:id', resumesController.getResumeById);
router.delete('/:id', resumesController.deleteResume);

module.exports = router;
