const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');
const userModel = sequelize.define("user", {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,

    },
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    deleted_At: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
},
    {
        paranoid: true,
        timestamps: true,
        deletedAt: 'deleted_At'
    }
)

userModel.sync({ alter: true })
module.exports = userModel;