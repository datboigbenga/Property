require("dotenv")
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {unauthenticated} = require("../errors")

const auth = async(req, res, next)=> {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new unauthenticated("Invalid authentication")
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(payload)
        req.user = {userID: payload.userId, admin:payload.admin}
        // console.log(req.user.admin)
        next()
        
    } catch (error) {
        console.log(error)
        throw new unauthenticated("Invalid authentication");
        
    }
}   

module.exports  = auth
