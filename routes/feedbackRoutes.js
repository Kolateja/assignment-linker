const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Routes
router.post('/', feedbackController.createFeed);  // POST for creating feedback
router.get('/', feedbackController.getAllFeeds); // GET for fetching all feedback

module.exports = router;
