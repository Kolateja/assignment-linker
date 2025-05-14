// controllers/notificationsController.js
const { Op, fn, col, where } = require('sequelize');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const users = require('../models/users')(sequelize, DataTypes);
const AcademicDetails = require('../models/academicDetails');
const { successResponse, errorResponse } = require('../middleware/response');

exports.getTodayBirthdays = async (req, res) => {
    try {
        // 1️⃣  Collect all DISTINCT userIds from academic_details
        const distinctRows = await AcademicDetails.findAll({
            attributes: [[sequelize.fn('DISTINCT', col('userId')), 'userId']],
            raw: true
        });
        const userIds = [...new Set(distinctRows.map(r => r.userId).filter(Boolean))];

        if (userIds.length === 0) {
            return successResponse(res, 'No academic records found', []);
        }

        // 2️⃣  Find matching users in the users table
        const matchedUsers = await users.findAll({
            where: { userId: { [Op.in]: userIds } },
            attributes: ['userId', 'username', 'email', 'phone'],
            raw: true
        });

        if (matchedUsers.length === 0) {
            return successResponse(res, 'No users found for those academic entries', []);
        }

        // 3️⃣  For each matched user, check if their DOB is today
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        const notifications = [];

        for (const u of matchedUsers) {
            const detail = await AcademicDetails.findOne({
                where: {
                    userId: u.userId,
                    [Op.and]: [
                        where(fn('MONTH', col('dateOfBirth')), month),
                        where(fn('DAY', col('dateOfBirth')), day),
                    ]
                },
                attributes: ['university', 'semester', 'course', 'dateOfBirth'],
                raw: true
            });

            if (detail) {
                notifications.push({
                    userId: u.userId,
                    name: u.username,
                    email: u.email,
                    phone: u.phone,
                    university: detail.university,
                    semester: detail.semester,
                    course: detail.course,
                    dateOfBirth: detail.dateOfBirth,
                });
            }
        }

        return successResponse(res, 'Birthdays fetched', notifications);
    } catch (err) {
        return errorResponse(res, 'Fetch failed', err.message);
    }
};
