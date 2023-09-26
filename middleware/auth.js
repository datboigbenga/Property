require("dotenv")
// const User = require("../models/user");
// const jwt = require("jsonwebtoken");
const customApiError = require("../errors")
const {isTokenValid, attachCookiesToresponse} = require("../utils")
const Token = require("../models/Token")

const auth = async(req, res, next)=> {
    const {accessToken, refreshToken} = req.signedCookies
   
    try {
        if(accessToken){
            const payload = isTokenValid(accessToken)
            req.user = payload.user
            return next()
        }
        const payload = isTokenValid(refreshToken)
        const existingToken = await Token.findOne({
            user: payload.user.userId,
            refreshToken: payload.refreshToken
        })
        if(!existingToken || !existingToken?.isValid){
            throw new customApiError.unauthenticated("Invalid Authentication")
        }
        attachCookiesToresponse({res, user:payload.user, refreshToken: existingToken.refreshToken})
        req.user = payload.user
        next();
    } catch (error) {
        throw new customApiError.unauthenticated("invalid Authentication")
    }

}

const authorizePermissions = (...roles)=>{
     return(req, res, next)=>{
        if(!roles.includes(req.user.role)){
            throw new customApiError.unaccessible("unable to access route")
        }
        next();
     }
}
module.exports  = {
    auth,
    authorizePermissions
}
