const express = require('express');
const router = express.Router();
const WriterDetail = require('../models/writersDetails');
const { successResponse, errorResponse } = require('../middleware/response');

// Create feedback
router.post('/', async (req, res) => {
    const {
        name,
        email,
        mobileNumber,
        altMobileNumber,
        minPrice,
        maxPrice,
        numberOfOrdersDelivered,
        yearsOfExperience,
        presentWorkingStatus,
        workedCountries,
        educationalDetails,
        subjectProficiency,
        languageProficiency,
        userId
    } = req.body;

    try {
        const feedback = await WriterDetail.create({
            name,
            email,
            mobileNumber,
            altMobileNumber,
            minPrice,
            maxPrice,
            numberOfOrdersDelivered,
            yearsOfExperience,
            presentWorkingStatus,
            workedCountries,
            educationalDetails,
            subjectProficiency,
            languageProficiency,
            userId
        });

        return successResponse(res, 'Feedback created', feedback);
    } catch (err) {
        return errorResponse(res, 'Creation failed', err.message);
    }
});


// Get all feedback
router.get('/', async (req, res) => {
    try {
        const writer = await WriterDetail.findAll();
        return successResponse(res, 'writer details fetched', writer);

    } catch (err) {
        return errorResponse(res, 'Fetch failed', err.message);
    }
});

// Get feedback by ID
router.get('/:userId', async (req, res) => {
    try {
        const writer = await WriterDetail.findOne({
            where: { userId: req.params.userId }
        });
        if (!writer) return res.status(404).json({ success: false, message: 'Writer not found.' });
        return successResponse(res, 'Writer details fetched', writer);
    } catch (err) {
        return errorResponse(res, 'Fetch failed', err.message);
    }
});


// Update feedback by ID
// Update feedback by ID
router.put('/:userId', async (req, res) => {
    try {
        const writer = await WriterDetail.findOne({
            where: { userId: req.params.userId }
        });
        if (!writer) return res.status(404).json({ success: false, message: 'writer not found.' });

        await writer.update(req.body);
        return successResponse(res, 'writer updated successfully', writer);
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ success: false, message: 'Failed to update writer.' });
    }
});

module.exports = router;
