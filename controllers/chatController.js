const { Op, Sequelize } = require('sequelize')
const chat = require('../models/chat_model')

const messageUser = async (req, res)=> {
    try {
        const { message, senderId, receiverId } = req.body;
        const newMessage = await chat.create({
            chat_message : message,
            from_user_id : senderId,
            to_user_id: receiverId
        })
        if(newMessage){
            return res.status(200).json({
                success : true,
                message : "Send message successfully",
                data : newMessage
            })
        }
        else{
            return res.status(400).json({
                success: false,
                message: "message is not send ",
               
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,

        })
    }
}

const getChatList_by_user_id = async(req, res) =>{
    try {
        const { senderId, receiverId} = req.query;
        if(!senderId && !receiverId){
            return res.status(400).json({
                status: false,
                msg : "please provide senderId and receiverId"
            })
        }
        const chatList = await chat.findAll({
            where : {
                [Sequelize.Op.or]: [
                    {
                        from_user_id: senderId,
                        to_user_id: receiverId
                    },
                    {
                        from_user_id: receiverId,
                        to_user_id: senderId
                    }
                ]
            }
        })
        if (chatList){
        return res.status(200).json({
            status : true,
            message : "get chat details",
            data : chatList
        })
    }else {
            return res.status(400).json({
                status: false,
                message: "chat not found"
            }) 
    }
    } catch (error) {
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}

const getAllChatMsg = async(req, res)=>{
    try {
        const msg = await chat.findAll()
        if(msg){
            return res.status(200).json({
                status: true,
                message: "get chat details",
                data: msg
            })
        }else{
            return res.status(400).json({
                status: false,
                message: "chat not found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

module.exports = {
    messageUser, getChatList_by_user_id, getAllChatMsg

}