const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderAssignment = sequelize.define('OrderAssignment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    orderStatus: {
        type: DataTypes.STRING,
        default: 'pending',
        validate: {
            isIn: [["pending", "inProgress", "awaitingClarification", "completed"]]
        },
    },
    paymentStatus: {
        type: DataTypes.STRING,
        default: 'pending',
        validate: {
            isIn: [["pending", "inProgress", "completed"]]
        },
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    university: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    wordCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    filePath: {
        type: DataTypes.STRING,
    },
    agreement: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    orderId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'OrderAssignments',
    timestamps: true,
});

module.exports = OrderAssignment;