const RaiseTicket = require('../models/raiseTicket');
const OrderAssignment = require('../models/orderAssignment');
const { successResponse, errorResponse } = require('../middleware/response');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return errorResponse(res, 'Unauthorized', null, 401);
    }
    next();
};

// ================== CONTROLLERS ===================

// Create Raise Ticket
exports.createRaiseTicket = async (req, res) => {
    try {
        const { orderId, description } = req.body;

        // Check if orderId exists in OrderAssignment
        const order = await OrderAssignment.findOne({ where: { orderId } });

        if (!order) {
            return res.status(404).json({ message: 'Order ID not found in OrderAssignment table' });
        }

        const ticket = await RaiseTicket.create({
            orderId,
            description,
            userId: req.session.userId
        });

        res.status(201).json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get All Tickets
exports.getAllRaiseTickets = async (req, res) => {
    try {
        const tickets = await RaiseTicket.findAll();
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Student Orders (fetch orders for logged in student)
exports.studentOrders = async (req, res) => {
    try {
        const studentOrders = await OrderAssignment.findAll({
            where: { userId: req.session.userId },
            raw: true,
        });

        console.log(studentOrders, ">>>>>");

        return successResponse(res, 'Order status counts fetched', studentOrders);
    } catch (err) {
        console.error('Status count error:', err);
        return errorResponse(res, 'Fetch failed', err.message);
    }
};

module.exports.requireAuth = requireAuth;
