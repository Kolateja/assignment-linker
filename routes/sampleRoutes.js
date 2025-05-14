// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const router = express.Router();
// const sampleController = require('../controllers/sampleController');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         if (file.mimetype === 'application/pdf') cb(null, 'uploads/pdfs');
//         else cb(null, 'uploads/images');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage });

// router.post('/create', upload.fields([
//     { name: 'image', maxCount: 1 },
//     { name: 'pdf', maxCount: 1 }
// ]), sampleController.createSample);

// router.get('/', sampleController.getAllSamples);
// router.get('/:id', sampleController.getSampleById);
// router.put('/:id', upload.fields([
//     { name: 'image', maxCount: 1 },
//     { name: 'pdf', maxCount: 1 }
// ]), sampleController.updateSample);
// router.delete('/:id', sampleController.deleteSample);

// module.exports = router;
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const c = require('../controllers/sampleController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, file.mimetype === 'application/pdf' ? 'uploads/pdfs' : 'uploads/images');
    },
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/create', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]), c.createSample);

router.get('/', c.getAllSamples);
router.get('/:id', c.getSampleById);

router.put('/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]), c.updateSample);

router.delete('/:id', c.deleteSample);

module.exports = router;
