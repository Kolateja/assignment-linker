const express = require('express');
const router = express.Router();
const raiseTicketController = require('../controllers/raiseTicketController');

// Apply requireAuth to protected routes
router.post('/', raiseTicketController.requireAuth, raiseTicketController.createRaiseTicket);
router.get('/', raiseTicketController.requireAuth, raiseTicketController.getAllRaiseTickets);
router.get('/student', raiseTicketController.requireAuth, raiseTicketController.studentOrders);

module.exports = router;
