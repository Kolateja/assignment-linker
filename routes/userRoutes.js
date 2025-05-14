// routes/userRoutes.js
const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const { successResponse, errorResponse } = require('../middleware/response');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // your Sequelize instance
const users = require('../models/users')(sequelize, DataTypes);
const bcrypt = require('bcrypt');
// Create a new user
router.post("/create", async (req, res) => {
    try {
        const { role = 'student', username, email, phone, password, accessStatus = 'Denied' } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Ideally, hash the password here
        const maxId = await users.max('id') || 0;
        const newId = maxId + 1;
        const userId = `UID-${String(newId).padStart(7, '0')}`;

        const user = await users.create({
            role,
            username,
            email,
            phone,
            accessStatus,
            password: hashedPassword,
            userId // 👈 pass userId manually
        });

        return successResponse(res, "User created successfully", user);
    } catch (error) {
        return errorResponse(res, "Error creating user", error);
    }
});


// Update User
router.post("/update/:id", async (req, res) => {
    try {
        const { role, username, email, phone, password, accessStatus } = req.body;
        const hashedPassword = password; // Hash password if needed

        const user = await users.update(
            { role, username, email, phone, password: hashedPassword, accessStatus },
            { where: { id: req.params.id }, returning: true }
        );

        return successResponse(res, "User updated successfully", user);
    } catch (error) {
        return errorResponse(res, "Error updating user", error);
    }
});

// Delete User
router.delete("/delete/:id", async (req, res) => {
    try {
        await users.destroy({ where: { id: req.params.id } });
        return successResponse(res, "User deleted successfully");
    } catch (error) {
        return errorResponse(res, "Error deleting user", error);
    }
});

// Get User by ID
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await users.findOne({ where: { userId } });
        if (!user) {
            return errorResponse(res, "User not found", 404);
        }
        return successResponse(res, "User fetched successfully", user);
    } catch (error) {
        return errorResponse(res, "Error fetching user", error);
    }
});

// Get All Users
router.get("/all", async (req, res) => {
    try {
        const allUsers = await users.findAll(); // ✅ Change variable name to avoid conflict
        return successResponse(res, "All users fetched successfully", allUsers);

    } catch (error) {
        return errorResponse(res, "Error fetching users", error);
    }
});


router.post("/search", async (req, res) => {
    try {
        const { name, email, phone, userId, role } = req.body;
        const whereCondition = {};

        if (name) whereCondition.username = { [Op.like]: `%${name}%` };
        if (role) whereCondition.username = { [Op.like]: `%${role}%` };
        if (email) whereCondition.email = { [Op.like]: `%${email}%` };
        if (phone) whereCondition.phone = { [Op.like]: `%${phone}%` };
        if (userId) whereCondition.userId = userId;

        const foundUsers = await users.findOne({ where: whereCondition });
        console.log(foundUsers, ">");
        return successResponse(res, "Search results", foundUsers);

    } catch (error) {
        return errorResponse(res, "Error searching users", error);
    }
});

// Count Users
router.get("/count", async (req, res) => {
    try {
        const count = await users.count();
        return successResponse(res, "User count fetched successfully", count);
    } catch (error) {
        return errorResponse(res, "Error fetching user count", error);
    }
});

module.exports = router;
