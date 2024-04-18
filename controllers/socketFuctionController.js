const chat = require('../models/chat_model');

function getCurrentDate() {
    const nDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Calcutta'
    })

    let formattedDate = nDate.split(", ").split('/')[2] +
        "-" +
        nDate.split(", ").split('/')[0] +
        "-" +
        nDate.split(", ").split('/')[1];

    return formattedDate
}

function getCurrentTime() {
    const nDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Calcutta'
    })
    let formattedDate = nDate.split(", ").split(':')[0] +
        "-" +
        nDate.split(", ").split(':')[1] +
        "-" +
        nDate.split(", ").split(':')[1];

    return formattedDate
}

const sendMessage = async (data, socket) => {
    try {
        const message = await chat.create({
            from_user_id: data.from_user_id,
            to_user_id: data.to_user_id,
            chat_message: data.message,
            message_status: 0,
            message_date: getCurrentDate(),
            message_time: getCurrentTime()
        })
        if (data.image) {
            message.image = data.image;
            await message.save()
        }
        data.id = message.id
        data.message_time = getCurrentTime()

        socket.emit('message_data', data)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendMessage
}