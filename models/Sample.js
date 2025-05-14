const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the Sample model
const Sample = sequelize.define('Sample', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pdf: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Export the model
module.exports = Sample;
