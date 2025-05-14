const express = require('express');
const router = express.Router();
const multer = require('multer');
const { successResponse, errorResponse } = require('../middleware/response');
const path = require('path');
const sequelize = require('../config/database');
const orderAssignment = require('../models/orderAssignment');
const imageconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads/orders");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: imageconfig,
    limits: { fileSize: 1000000000 }
});
// Middleware: Auth check
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return errorResponse(res, 'Unauthorized', null, 401);
    }
    next();
};


// CREATE
// router.post('/', requireAuth, upload.single('file'), async (req, res) => {
//     try {
//         const { subject, university, deadline, wordCount, pages, description, agreement, orderStatus = 'pending' } = req.body;
//         const filePath = req.file ? req.file.path : null; // File path from the uploaded file

//         // if (req.file) {
//         //     req.body.filePath = req.file.filename;
//         //     console.log("Uploaded File:", req.file.filename);
//         // }
//         console.log(req.body, "{{{{{{{{")
//         const maxId = await orderAssignment.max('id');
//         const newId = maxId + 1;
//         const orderId = `ALO-${String(newId).padStart(7, '0')}`;
//         const assignment = await orderAssignment.create({
//             subject,
//             university,
//             deadline,
//             wordCount,
//             pages,
//             description,
//             filePath: filePath,
//             agreement,
//             userId: req.session.userId,
//             orderId,
//             orderStatus
//         });
//         console.log(assignment, "????????")
//         return successResponse(res, 'Assignment created', assignment);
//     } catch (err) {
//         return errorResponse(res, 'Creation failed', err.message);
//     }
// });

router.post('/', requireAuth, upload.array('files'), async (req, res) => {
    try {
        const {
            subject, university, deadline, wordCount, pages,
            description, agreement, orderStatus = 'pending'
        } = req.body;

        // Gather all uploaded file paths
        const filePaths = req.files.map(file => file.path); // array of file paths

        // Convert array to a single string (comma-separated)
        const filePathString = filePaths.join(',');

        const maxId = await orderAssignment.max('id');
        const newId = maxId + 1;
        const orderId = `ALO-${String(newId).padStart(7, '0')}`;

        const assignment = await orderAssignment.create({
            subject,
            university,
            deadline,
            wordCount,
            pages,
            description,
            filePath: filePathString, // store as single string
            agreement,
            userId: req.session.userId,
            orderId,
            orderStatus
        });

        return successResponse(res, 'Assignment created', assignment);
    } catch (err) {
        return errorResponse(res, 'Creation failed', err.message);
    }
});



router.get('/', requireAuth, async (req, res) => {
    try {
        // Check if the user is an admin or super admin
        // if (req.session.role === 'admin' || req.session.role === 'super admin') {

        // } else {
        //     // If not admin or super admin, fetch assignments by userId
        //     const assignments = await orderAssignment.findAll({
        //         where: { userId: req.session.userId } // use session userId for normal users
        //     });
        //     return successResponse(res, 'Assignments fetched', assignments);
        // }
        // If admin or super admin, fetch all assignments
        const assignments = await orderAssignment.findAll();
        return successResponse(res, 'All assignments fetched', assignments);
    } catch (err) {
        return errorResponse(res, 'Fetch failed', err.message);
    }
});
router.get('/status-counts', requireAuth, async (req, res) => {
    try {
        const whereCondition = {};

        // Only apply user filter if NOT admin/super admin
        const isAdmin = req.session.role === 'admin' || req.session.role === 'super admin';
        if (!isAdmin) {
            whereCondition.userId = req.session.userId;
        }

        const statusCounts = await orderAssignment.findAll({
            attributes: [
                'orderStatus',
                [sequelize.fn('COUNT', sequelize.col('orderStatus')), 'count']
            ],
            where: whereCondition,
            group: ['orderStatus'],
            raw: true
        });

        return successResponse(res, 'Order status counts fetched', statusCounts);
    } catch (err) {
        console.error('Status count error:', err);
        return errorResponse(res, 'Fetch failed', err.message);
    }
});



// GET BY ID
// router.get('/:id', requireAuth, async (req, res) => {
//     try {
//         const assignment = await orderAssignment.findOne({
//             where: {
//                 id: req.params.id,
//             }
//         });
//         const baseUrl = `${req.protocol}://${req.get('host')}`;
//         const resumeWithUrl = {
//             ...assignment.dataValues,
//             fileUrl: assignment.filePath ? `${baseUrl}/${assignment.filePath.replace(/\\/g, '/')}` : null
//         };

//         console.log(resumeWithUrl, ";;777;;")
//         if (!resumeWithUrl) {
//             return errorResponse(res, 'Assignment not found', null, 404);
//         }
//         return successResponse(res, 'Assignment fetched', resumeWithUrl);
//     } catch (err) {
//         return errorResponse(res, 'Fetch failed', err.message);
//     }
// });

router.get('/:orderId', requireAuth, async (req, res) => {
    try {
        const assignment = await orderAssignment.findOne({
            where: {
                orderId: req.params.orderId,
            }
        });

        if (!assignment) {
            return errorResponse(res, 'Assignment not found', null, 404);
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // Handle multiple file paths
        const filePaths = assignment.filePath
            ? assignment.filePath.split(',').map(path => `${baseUrl}/${path.replace(/\\/g, '/')}`)
            : [];

        const resumeWithUrl = {
            ...assignment.dataValues,
            fileUrls: filePaths // renamed from fileUrl to fileUrls (array)
        };

        return successResponse(res, 'Assignment fetched', resumeWithUrl);
    } catch (err) {
        return errorResponse(res, 'Fetch failed', err.message);
    }
});


// UPDATE
router.put('/:id', requireAuth, upload.single('file'), async (req, res) => {
    try {
        const assignment = await orderAssignment.findOne({ where: { id: req.params.id } });
        if (!assignment) return errorResponse(res, 'Assignment not found', null, 404);

        const { subject, university, deadline, wordCount, pages, description, orderStatus } = req.body;
        const filePath = req.file ? req.file.path : assignment.filePath;

        await assignment.update({ subject, university, deadline, wordCount, pages, description, filePath, orderStatus });

        return successResponse(res, 'Assignment updated', assignment);
    } catch (err) {
        return errorResponse(res, 'Update failed', err.message);
    }
});

// DELETE
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const assignment = await orderAssignment.findOne({ where: { id: req.params.id } });
        if (!assignment) return errorResponse(res, 'Assignment not found', null, 404);

        await assignment.destroy();
        return successResponse(res, 'Assignment deleted');
    } catch (err) {
        return errorResponse(res, 'Delete failed', err.message);
    }
});

router.get('/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(req.params, "{{{{{{{")
        const assignment = await orderAssignment.findAll({ where: { userId } });
        console.log(assignment, "???????????")
        if (!assignment) return errorResponse(res, 'order not found', null, 404);
        return successResponse(res, 'order found', assignment);
    } catch (err) {
        return errorResponse(res, 'order failed to found', err.message);
    }
});


module.exports = router;
