const express = require('express');
const router = express.Router();
const academicDetailsController = require('../controllers/academicDetailsController');

// Add Academic Details
router.post('/', academicDetailsController.addAcademicDetails);

// Edit Academic Details by ID
router.put('/:id', academicDetailsController.editAcademicDetails);

// Delete Academic Details by ID
router.delete('/:id', academicDetailsController.deleteAcademicDetails);

// Get All Academic Details
router.get('/', academicDetailsController.getAllAcademicDetails);

// Get Academic Details by ID
router.get('/:userId', academicDetailsController.getAcademicDetailsById);

module.exports = router;
