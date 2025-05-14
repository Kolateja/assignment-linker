const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AcademicDetails = sequelize.define('AcademicDetails', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    university: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    semester: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    course: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stateProvinceOfOrigin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    countryOfOrigin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currentCountryOfStudy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currentStateProvinceOfStudy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'academic_details',
    timestamps: true,
});

module.exports = AcademicDetails;
