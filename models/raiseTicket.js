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
    ticketStatus: {
        type: DataTypes.STRING,
        default: 'pending',
        validate: {
            isIn: [["pending", "inProgress","resolved"]]
        },
    },
}, {
    tableName: 'RaiseTickets',
    timestamps: true,
});

module.exports = RaiseTicket;