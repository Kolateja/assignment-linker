const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FeedBack = sequelize.define('feedBack', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    orderCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'feedBacks',
    timestamps: true,
});

module.exports = FeedBack;
