const express = require('express');
const router = express.Router();
const WriterFeedback = require('../models/WriterFeedback');
const OrderAssignment = require('../models/orderAssignment');
const { successResponse, errorResponse } = require('../middleware/response');

// Create feedback
router.post('/', async (req, res) => {
    const {
        failedToDeliver,
        numberOfEdits,
        writerRating,
        laterPriceDemanding,
        lateDeliveries,
        assignmentFailed,
        issues,
        orderCode,
        userId
    } = req.body;

    try {
        const order = await OrderAssignment.findOne({ where: { orderId: orderCode } });
        if (!order) {
            return res.status(400).json({ success: false, message: 'Order ID not found in assignments.' });
        }

        const feedback = await WriterFeedback.create({
            failedToDeliver,
            numberOfEdits,
            writerRating,
            laterPriceDemanding,
            lateDeliveries,
            assignmentFailed,
            issues,
            orderCode,
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
        const feedbacks = await WriterFeedback.findAll();
        return successResponse(res, 'feedbacks fetched', feedbacks);

    } catch (err) {
        return errorResponse(res, 'Fetch failed', err.message);
    }
});


router.get('/:userId', async (req, res) => {
    try {
        const writer = await WriterFeedback.findOne({
            where: { userId: req.params.userId }
        });
        if (!writer) return res.status(404).json({ success: false, message: 'Feedback not found.' });
        return successResponse(res, 'Writer details fetched', writer);
    } catch (err) {
        return errorResponse(res, 'Fetch failed', err.message);
    }
});

router.put('/:userId', async (req, res) => {
    try {
        const Feedback = await WriterFeedback.findOne({
            where: { userId: req.params.userId }
        });
        if (!Feedback) return res.status(404).json({ success: false, message: 'Feedback not found.' });

        // Log the incoming data
        console.log('Request body:', req.body);

        await Feedback.update(req.body);
        return successResponse(res, 'Feedback updated successfully', Feedback);
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ success: false, message: 'Failed to update Feedback.' });
    }
});


module.exports = router;
