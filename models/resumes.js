const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const resume = sequelize.define('resume', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    filePath: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'resumes',
    timestamps: true,
});

module.exports = resume;