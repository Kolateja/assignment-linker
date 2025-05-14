const Sample = require('../models/Sample');
const { successResponse, errorResponse } = require('../middleware/response');

exports.createSample = async (req, res) => {
    try {
        const { title, category } = req.body;
        const image = req.files.image?.[0]?.filename;
        const pdf = req.files.pdf?.[0]?.filename;

        const sample = await Sample.create({ title, category, image, pdf });
        return successResponse(res, 'sample created', sample);
    } catch (err) {
        return errorResponse(res, 'Creation failed', err.message);
    }
};

exports.getAllSamples = async (req, res) => {
    try {
        const samples = await Sample.findAll();
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const mapped = samples.map(s => ({
            ...s.dataValues,
            imageUrl: s.image ? `${baseUrl}/uploads/images/${s.image}` : null,
            pdfUrl: s.pdf ? `${baseUrl}/uploads/pdfs/${s.pdf}` : null,
        }));

        return successResponse(res, 'samples fetched', mapped);

    } catch (err) {
        return errorResponse(res, 'fetch failed', err.message);
    }
};

exports.getSampleById = async (req, res) => {
    try {
        const sample = await Sample.findByPk(req.params.id);
        if (!sample) return res.status(404).json({ message: 'Sample not found' });
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const mapped = {
            ...sample.dataValues,
            imageUrl: sample.image ? `${baseUrl}/uploads/images/${sample.image}` : null,
            pdfUrl: sample.pdf ? `${baseUrl}/uploads/pdfs/${sample.pdf}` : null,
        };

        return successResponse(res, 'resume fetched', mapped);
    } catch (err) {
        return errorResponse(res, 'failed', err.message);
    }
};

exports.updateSample = async (req, res) => {
    try {
        const { title, category } = req.body;
        const sample = await Sample.findByPk(req.params.id);
        if (!sample) return res.status(404).json({ message: 'Sample not found' });

        const image = req.files.image?.[0]?.filename || sample.image;
        const pdf = req.files.pdf?.[0]?.filename || sample.pdf;

        await sample.update({ title, category, image, pdf });
        res.status(200).json(sample);
    } catch (err) {
        return errorResponse(res, 'failed', err.message);
    }
};

exports.deleteSample = async (req, res) => {
    try {
        const sample = await Sample.findByPk(req.params.id);
        if (!sample) return res.status(404).json({ message: 'Sample not found' });

        await sample.destroy();
        res.status(204).send();
    } catch (err) {
        return errorResponse(res, 'failed', err.message);
    }
};
