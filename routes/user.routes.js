const express = require('express')
const router = express.Router()
const { createUser, isLogged ,loginUser, sessionMiddleware,logout,authenticateMiddleware} = require('../controllers/userController');
const { generate_access_token } = require('../middlewares/userAuthentication');



router.post('/registration', createUser);
router.post('/login',loginUser);
router.get('/isLogged',isLogged);
router.get('/accesstoken', generate_access_token);
router.post('/logout',logout);


module.exports = router;
