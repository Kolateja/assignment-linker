const express = require('express');
const bcrypt = require('bcrypt');
const { successResponse, errorResponse } = require('../middleware/response');
const router = express.Router();
// ✅ Get sequelize and DataTypes from your Sequelize setup
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');// adjust path if needed

// ✅ Now pass them to your user model
const users = require('../models/users')(sequelize, DataTypes);

// Register
router.post('/register', async (req, res) => {
    const { username, phone, email, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);

        // Generate userId similar to /create
        const maxId = await users.max('id') || 0;
        const newId = maxId + 1;
        const userId = `UID-${String(newId).padStart(7, '0')}`;

        const user = await users.create({
            username,
            phone,
            email,
            accessStatus,
            password: hash,
            role: 'student', // ensure default student role
            userId
        });

        return successResponse(res, "Registered successfully", user);
    } catch (err) {
        return errorResponse(res, "Registration failed", err.message || err);
    }
});


// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await users.findOne({ where: { email } });

        if (!user) {
            return errorResponse(res, "User not found");
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return errorResponse(res, "Incorrect password");
        }

        req.session.userId = user.userId;
        req.session.userEmail = user.email;
        req.session.role = user.role;
        req.session.username = user.username;
        req.session.phone = user.phone;



        return successResponse(res, "Login successful", {
            userId: user.userId,
            role: user.role,
            email: user.email,
        });
    } catch (err) {
        return errorResponse(res, "Login failed", err.message || err);
    }
});

router.post('/change-password', async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            return errorResponse(res, "New password and confirm password do not match");
        }

        // Get the current user's email or userId from the session or request
        const userId = req.session.userId;
        if (!userId) {
            return errorResponse(res, "Unauthorized access", null, 401);
        }

        // Retrieve the user from the database
        const user = await users.findOne({ where: { userId } });
        if (!user) {
            return errorResponse(res, "User not found");
        }

        // Compare the old password with the stored password hash
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return errorResponse(res, "Old password is incorrect");
        }

        // Validate the new password (add any additional validation here)
        if (newPassword.length < 6) {
            return errorResponse(res, "New password must be at least 6 characters");
        }

        // Hash the new password
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        user.password = newHashedPassword;
        await user.save();

        // Respond with success
        return successResponse(res, "Password changed successfully");
    } catch (err) {
        return errorResponse(res, "Failed to change password", err.message || err);
    }
});


router.post('/reset-link', async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    try {
        if (!token) return res.status(400).json({ message: 'Token is required' });
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const user = await users.findOne({ where: { resetToken: token } });

        if (!user || new Date(user.resetTokenExpires) < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();

        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Reset error:', err);
        return res.status(500).json({ message: 'Failed to reset password' });
    }
});


router.get('/profile', (req, res) => {
    try {
        if (!req.session.userId) {
            return errorResponse(res, "Unauthorized access", null, 401);
        }
        const { userId, username, role, userEmail, phone } = req.session;
        return successResponse(res, "Welcome to your profile", { userId, username, role, userEmail, phone });
    } catch (err) {
        return errorResponse(res, "Failed to retrieve profile", err.message || err);
    }
});

// Logout
router.post('/logout', (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return errorResponse(res, "Logout failed", err.message || err);
            }
            return successResponse(res, "Logged out successfully");
        });
    } catch (err) {
        return errorResponse(res, "Logout error", err.message || err);
    }
});

module.exports = router;
