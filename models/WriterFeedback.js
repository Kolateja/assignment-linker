const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WriterFeedback = sequelize.define('WriterFeedback', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    orderCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    writerRating: {
        type: DataTypes.ENUM("1-Poor", "2-Fair", "3-Good", "4-Very Good", "5-Excellent"),
        allowNull: false,
    },


    numberOfEdits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    failedToDeliver: {
        type: DataTypes.ENUM('no', 'yes'),
        allowNull: false,
        defaultValue: 'no',
    },
    laterPriceDemanding: {
        type: DataTypes.ENUM('no', 'yes'),
        allowNull: false,
        defaultValue: 'no',
    },
    lateDeliveries: {
        type: DataTypes.ENUM('no', 'yes'),
        allowNull: false,
        defaultValue: 'no',
    },
    assignmentFailed: {
        type: DataTypes.ENUM('no', 'yes'),
        allowNull: false,
        defaultValue: 'no',
    },
    issues: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'WriterFeedbacks',
    timestamps: true,
});
module.exports = WriterFeedback;
