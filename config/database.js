const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('assignment_db', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    sync: true
});

module.exports = sequelize;
