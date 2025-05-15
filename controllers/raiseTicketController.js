const RaiseTicket = require('../models/raiseTicket');
const OrderAssignment = require('../models/orderAssignment');
const { successResponse, errorResponse } = require('../middleware/response');
const path = require('path');
const sequelize = require('../config/database');
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
        const { orderId, description ,ticketStatus='pending'} = req.body;
        // Check if orderId exists in OrderAssignment
        const order = await OrderAssignment.findOne({ where: { orderId } });

        if (!order) {
            return res.status(404).json({ message: 'Order ID not found in OrderAssignment table' });
        }

        const ticket = await RaiseTicket.create({
            orderId,
            description,
            userId: req.session.userId,
            ticketStatus
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
        if (!tickets) return errorResponse(res, 'ticket not found', null, 404);

        return successResponse(res, 'ticket found', tickets);
    } catch (err) {
        return errorResponse(res, 'ticket failed to found', err.message);
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

exports.studentTickets = async (req, res) => {
    try {
        const { userId } = req.params;
        const studentOrders = await RaiseTicket.findAll({
            where: { userId }
        });


        return successResponse(res, 'Order status counts fetched', studentOrders);
    } catch (err) {
        console.error('Status count error:', err);
        return errorResponse(res, 'Fetch failed', err.message);
    }
};

exports.studentTicketTable= async (req, res) => {
    try {
        const whereCondition = {};

        // Only apply user filter if NOT admin/super admin
        const isAdmin = req.session.role === 'admin' || req.session.role === 'super admin';
        if (!isAdmin) {
            whereCondition.userId = req.session.userId;
        }

        const statusCounts = await RaiseTicket.findAll({
            attributes: [
                'ticketStatus',
                [sequelize.fn('COUNT', sequelize.col('ticketStatus')), 'count']
            ],
            where: whereCondition,
            group: ['ticketStatus'],
            raw: true
        });

        return successResponse(res, 'Order status counts fetched', statusCounts);
    } catch (err) {
        console.error('Status count error:', err);
        return errorResponse(res, 'Fetch failed', err.message);
    }
}

exports.editAcademicDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const {orderId, description ,ticketStatus,userId } = req.body;
console.log(id,"pp")
        const academicDetails = await RaiseTicket.findByPk(id);
console.log(academicDetails,"??")
        if (!academicDetails) {
            return res.status(404).json({ message: 'ticket Details not found' });
        }

        academicDetails.orderId = orderId || academicDetails.orderId;
        academicDetails.description = description || academicDetails.description;
        academicDetails.ticketStatus = ticketStatus || academicDetails.ticketStatus;
        academicDetails.userId = userId || req.session.userId
        await academicDetails.save();
        return successResponse(res, 'ticket updated', academicDetails);

    } catch (err) {
        return errorResponse(res, 'Update failed', err.message);
    }
};
module.exports.requireAuth = requireAuth;