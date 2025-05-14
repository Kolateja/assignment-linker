

module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        role: {
            type: DataTypes.STRING,
            default: 'student',
            validate: {
                isIn: [["student", "admin", "writer", "super admin"]]
            },
        },
        accessStatus: {
            type: DataTypes.STRING,
            default: 'Denied',
            validate: {
                isIn: [["Denied", "Allowed"]]
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            // unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
        },
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetTokenExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },

    });

    return users;
};
