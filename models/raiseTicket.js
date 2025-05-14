const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RaiseTicket = sequelize.define('RaiseTicket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'RaiseTickets',
    timestamps: true,
});

module.exports = RaiseTicket;
