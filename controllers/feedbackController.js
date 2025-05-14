const FeedBack = require('../models/feedBack');
const OrderAssignment = require('../models/orderAssignment');
const { successResponse, errorResponse } = require('../middleware/response');

// Create feedback
exports.createFeed = async (req, res) => {
    try {
        const { name, phoneNumber, comment, orderCode, rating } = req.body;

        // Check if the orderCode exists in the OrderAssignment table
        const orderExists = await OrderAssignment.findOne({ where: { orderId: orderCode } });

        if (!orderExists) {
            return res.status(404).json({ message: 'Order code not found' });
        }

        // Create feedback
        const feedback = await FeedBack.create({
            name,
            phoneNumber,
            comment,
            orderCode,
            rating
        });
        return successResponse(res, 'feedback created', feedback);
    } catch (err) {
        console.error('Validation Error:', err); // 👈 Add this line
        return errorResponse(res, 'Creation failed', err.message);
    }

};

// Get all feedbacks
exports.getAllFeeds = async (req, res) => {
    try {
        const feedbacks = await FeedBack.findAll();
        return successResponse(res, 'feedbacks fetched', feedbacks);
    } catch (err) {
        return errorResponse(res, 'Fetch failed', err.message);
    }
};
