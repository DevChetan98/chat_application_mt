const jwt = require('jsonwebtoken');
const accessSecretkey = process.env.ACCESS_TOKEN_SECRET;
const refreshSecretkey = "jsonweb123";

const generateAccessToken = (user) =>{
    const payload = {
        id :user.id,
        email : user.email
    }
    return jwt.sign(payload,accessSecretkey,{expiresIn:'1m'});
}

const generateRefreshToken = ()=>{
    return jwt.sign({}, refreshSecretkey , {expiresIn:'3h'});
}

module.exports={
    generateAccessToken,
    generateRefreshToken
}