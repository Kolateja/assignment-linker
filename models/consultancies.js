const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Consultancies = sequelize.define('Consultancies', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'Consultancies',
    timestamps: true
});

module.exports = Consultancies;
