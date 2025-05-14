const Resume = require('../models/resumes');
const { successResponse, errorResponse } = require('../middleware/response');

// Create a new resume

exports.createResume = async (req, res) => {
    try {
        const { username, email, phone } = req.body;
        const filePath = req.file ? req.file.path : null; // File path from the uploaded file
        const resume = await Resume.create({ username, email, phone, filePath });
        return successResponse(res, 'resume created', resume);
    } catch (err) {
        return errorResponse(res, 'Creation failed', err.message);
    }
};


// Get all resumes
exports.getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.findAll();
        const baseUrl = `${req.protocol}://${req.get('host')}`; // e.g. http://localhost:3000

        const resumesWithUrl = resumes.map(resume => {
            return {
                ...resume.dataValues,
                fileUrl: resume.filePath ? `${baseUrl}/${resume.filePath.replace(/\\/g, '/')}` : null
            };
        });

        return successResponse(res, 'resumes fetched', resumesWithUrl);
    } catch (err) {
        return errorResponse(res, 'Fetch failed', err.message);
    }
};

// Get resume by ID
exports.getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findByPk(req.params.id);
        if (!resume) return res.status(404).json({ message: 'Resume not found' });

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const resumeWithUrl = {
            ...resume.dataValues,
            fileUrl: resume.filePath ? `${baseUrl}/${resume.filePath.replace(/\\/g, '/')}` : null
        };

        return successResponse(res, 'resume fetched', resumeWithUrl);
    } catch (err) {
        return errorResponse(res, 'Fetch failed', err.message);
    }
};



exports.deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = await Resume.findByPk(id);
        if (!resume) return res.status(404).json({ message: 'Resume not found' });

        // Optional: delete file from filesystem too
        const fs = require('fs');
        if (resume.filePath) {
            fs.unlinkSync(resume.filePath); // be sure to handle errors here in real code
        }

        await resume.destroy();
        return res.json({ message: 'Resume deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to delete resume', error: err.message });
    }
};

