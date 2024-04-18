const { DataTypes } = require('sequelize')
const sequelize = require('../dbConfig')

const chat = sequelize.define('chat', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    from_user_id: {
        type: DataTypes.INTEGER,
    },
    to_user_id: {
        type: DataTypes.INTEGER,
    },
    chat_message: {
        type: DataTypes.STRING,
    },
    message_date: {
        type: DataTypes.DATEONLY,
    },
    message_time: {
        type: DataTypes.DATEONLY,
    },
    message_status: {
        type: DataTypes.BOOLEAN,
    },
    image: {
        type: DataTypes.STRING,
    },
    message_type: {
        type: DataTypes.STRING,
    },
    device_id : {
        type : DataTypes.STRING,
    },
    unread_msg : {
        type : DataTypes.BOOLEAN
    }
})
chat.sync({ alter : true })
module.exports = chat;