const express = require('express');
const router = express.Router();
const Consultancies = require('../controllers/consultanciesController');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes
router.post('/create', upload.single('image'), Consultancies.createConsultancies);
router.get('/', Consultancies.getAllConsultanciess);
router.get('/:id', Consultancies.getConsultanciesById);
router.put('/:id', upload.single('image'), Consultancies.updateConsultancies);
router.delete('/:id', Consultancies.deleteConsultancies);

module.exports = router;
