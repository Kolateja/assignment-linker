const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');

// Add Academic Details
router.post('/', transactionsController.addTransaction);

// Get All Academic Details
router.get('/', transactionsController.getAllTransactions);

// Get Academic Details by ID
router.get('/:userId', transactionsController.getTransactionByUserId);

module.exports = router;
