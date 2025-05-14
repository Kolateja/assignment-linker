const Consultancies = require('../models/consultancies');
const { successResponse, errorResponse } = require('../middleware/response');

// Create Consultancies
exports.createConsultancies = async (req, res) => {
    try {
        const { title } = req.body;
        const image = req.file ? req.file.path : null;

        const consultancies = await Consultancies.create({
            title,
            image
        });
        return successResponse(res, 'Consultancies created', consultancies);
    } catch (err) {
        return errorResponse(res, 'Creation failed', err.message);
    }
};

exports.getAllConsultanciess = async (req, res) => {
    try {
        const consultanciess = await Consultancies.findAll();
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const ConsultanciessWithImageUrl = consultanciess.map(consultancy => ({
            ...consultancy.dataValues,
            fileUrl: consultancy.image ? `${baseUrl}/${consultancy.image.replace(/\\/g, '/')}` : null
        }));
        return successResponse(res, 'Consultanciess fetched', ConsultanciessWithImageUrl);
    } catch (err) {
        return errorResponse(res, 'Fetch failed', err.message);
    }
};


// Get Consultancies by ID
exports.getConsultanciesById = async (req, res) => {
    try {
        const consultanciess = await Consultancies.findByPk(req.params.id);
        if (!consultanciess) {
            return res.status(404).json({ error: 'Consultancies not found' });
        }
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const resumeWithUrl = {
            ...consultanciess.dataValues,
            fileUrl: consultanciess.image ? `${baseUrl}/${consultanciess.image.replace(/\\/g, '/')}` : null
        };

        return successResponse(res, 'Consultancies fetched', resumeWithUrl);
    } catch (err) {
        return errorResponse(res, 'Consultancies failed', err.message);
    }
};

// Update Consultancies
exports.updateConsultancies = async (req, res) => {
    try {
        const consultanciess = await Consultancies.findByPk(req.params.id);
        if (!consultanciess) {
            return res.status(404).json({ error: 'Consultancies not found' });
        }

        const { title } = req.body;
        const image = req.file ? req.file.path : consultanciess.image;

        await consultanciess.update({
            title,
            image
        });

        res.status(200).json(consultanciess);
    } catch (err) {
        return errorResponse(res, 'failed', err.message);
    }
};

// Delete Consultancies
exports.deleteConsultancies = async (req, res) => {
    try {
        const consultanciess = await Consultancies.findByPk(req.params.id);
        if (!consultanciess) {
            return res.status(404).json({ error: 'Consultancies not found' });
        }

        await consultanciess.destroy();
        res.status(200).json({ message: 'Consultancies deleted successfully' });
    } catch (err) {
        return errorResponse(res, 'failed', err.message);
    }
};
