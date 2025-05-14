const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WriterDetail = sequelize.define('WriterDetail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    mobileNumber: { type: DataTypes.STRING, allowNull: false },
    altMobileNumber: { type: DataTypes.STRING },

    minPrice: { type: DataTypes.FLOAT, allowNull: false },
    maxPrice: { type: DataTypes.FLOAT, allowNull: false },
    numberOfOrdersDelivered: { type: DataTypes.INTEGER, defaultValue: 0 },

    yearsOfExperience: { type: DataTypes.INTEGER },

    presentWorkingStatus: {
        type: DataTypes.ENUM('freelancer', 'working in college/university/company', 'not working'),
        allowNull: false,
    },

    // JSON/ARRAY FIELDS
    workedCountries: {
        type: DataTypes.JSON, // or DataTypes.ARRAY(DataTypes.STRING) for PostgreSQL
        allowNull: true,
    },

    educationalDetails: {
        type: DataTypes.JSON, // array of objects with { degree, specialization }
        allowNull: true,
    },

    subjectProficiency: {
        type: DataTypes.JSON, // array of strings
        allowNull: true,
    },

    languageProficiency: {
        type: DataTypes.JSON, // array of strings
        allowNull: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'WriterDetails',
    timestamps: true,
});

module.exports = WriterDetail;
