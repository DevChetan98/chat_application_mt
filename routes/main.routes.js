const router = require('express').Router()
const userRouter = require('../routes/user.routes');
const chatRouter = require('../routes/chat.routes')

router.use('/user',userRouter);
router.use('/chat', chatRouter)

module.exports=router;