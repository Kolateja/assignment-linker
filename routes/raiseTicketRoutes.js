
const express = require('express');
const router = express.Router();
const raiseTicketController = require('../controllers/raiseTicketController');

// Apply requireAuth to protected routes
router.post('/', raiseTicketController.requireAuth, raiseTicketController.createRaiseTicket);
router.get('/', raiseTicketController.requireAuth, raiseTicketController.getAllRaiseTickets);
router.get('/student', raiseTicketController.requireAuth, raiseTicketController.studentOrders);
router.get('/ticket/:userId', raiseTicketController.requireAuth, raiseTicketController.studentTickets);
router.get('/ticket-counts', raiseTicketController.requireAuth, raiseTicketController.studentTicketTable);
router.put('/editTickets/:id', raiseTicketController.requireAuth, raiseTicketController.editAcademicDetails);

module.exports = router;