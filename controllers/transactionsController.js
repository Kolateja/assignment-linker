const Transaction = require('../models/transaction'); // Correct model import
const { successResponse, errorResponse } = require('../middleware/response');

// Create a new transaction
exports.addTransaction = async (req, res) => {
    try {
        const {
            transactionId,
            totalAmount,
            paymentMethod,
            paymentStatus,
            orderId
        } = req.body;

        const newTransaction = await Transaction.create({
            transactionId,
            totalAmount,
            paymentMethod,
            paymentStatus,
            orderId,
            userId: req.session.userId, // from session
        });

        return successResponse(res, 'Transaction created successfully', newTransaction);
    } catch (err) {
        return errorResponse(res, 'Transaction creation failed', err.message);
    }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        return successResponse(res, 'All transactions fetched successfully', transactions);
    } catch (err) {
        return errorResponse(res, 'Fetching all transactions failed', err.message);
    }
};

// Get a transaction by userId
exports.getTransactionByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const transaction = await Transaction.findOne({ where: { userId } });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        return successResponse(res, 'Transaction fetched successfully', transaction);
    } catch (err) {
        return errorResponse(res, 'Fetching transaction failed', err.message);
    }
};
