const AcademicDetails = require('../models/academicDetails');
const { successResponse, errorResponse } = require('../middleware/response');

// Add Academic Details
exports.addAcademicDetails = async (req, res) => {
    try {
        const { university, dateOfBirth, semester, course, stateProvinceOfOrigin, countryOfOrigin, currentCountryOfStudy, currentStateProvinceOfStudy } = req.body;

        const academicDetails = await AcademicDetails.create({
            university,
            dateOfBirth,
            semester,
            course,
            stateProvinceOfOrigin,
            countryOfOrigin,
            currentCountryOfStudy,
            currentStateProvinceOfStudy,
            userId: req.session.userId,
        });

        res.status(201).json(academicDetails);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Edit Academic Details
exports.editAcademicDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { university, dateOfBirth, semester, course, stateProvinceOfOrigin, countryOfOrigin, currentCountryOfStudy, currentStateProvinceOfStudy, userId } = req.body;

        const academicDetails = await AcademicDetails.findByPk(id);

        if (!academicDetails) {
            return res.status(404).json({ message: 'Academic Details not found' });
        }

        academicDetails.university = university || academicDetails.university;
        academicDetails.dateOfBirth = dateOfBirth || academicDetails.dateOfBirth;
        academicDetails.semester = semester || academicDetails.semester;
        academicDetails.course = course || academicDetails.course;
        academicDetails.stateProvinceOfOrigin = stateProvinceOfOrigin || academicDetails.stateProvinceOfOrigin;
        academicDetails.countryOfOrigin = countryOfOrigin || academicDetails.countryOfOrigin;
        academicDetails.currentCountryOfStudy = currentCountryOfStudy || academicDetails.currentCountryOfStudy;
        academicDetails.currentStateProvinceOfStudy = currentStateProvinceOfStudy || academicDetails.currentStateProvinceOfStudy;
        academicDetails.userId = userId || req.session.userId
        await academicDetails.save();

        res.status(200).json(academicDetails);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete Academic Details
exports.deleteAcademicDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const academicDetails = await AcademicDetails.findByPk(id);

        if (!academicDetails) {
            return res.status(404).json({ message: 'Academic Details not found' });
        }

        await academicDetails.destroy();

        res.status(200).json({ message: 'Academic Details deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all Academic Details
exports.getAllAcademicDetails = async (req, res) => {
    try {
        const academicDetails = await AcademicDetails.findAll();
        res.status(200).json(academicDetails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Academic Details by ID
exports.getAcademicDetailsById = async (req, res) => {
    try {
        const { userId } = req.params;

        const academicDetails = await AcademicDetails.findOne({ where: { userId } }); // ✅ correct


        if (!academicDetails) {
            return res.status(404).json({ message: 'Academic Details not found' });
        }
        return successResponse(res, 'academicDetails fetched', academicDetails);

        res.status(200).json(academicDetails);
    } catch (err) {
        return errorResponse(res, 'Creation failed', err.message);
    }
};
