const router = require('express').Router()
const chat = require('../controllers/chatController')

router.post('/create_chat', chat.messageUser)
router.get('/get_all_chat', chat.getAllChatMsg)
router.get('/get_chat_by_id', chat.getChatList_by_user_id)

module.exports = router;