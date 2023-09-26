const {
    createJWT,
    isTokenValid,
    attachCookiesToresponse
} = require("./jwt")

const createTokenUser =require("./createTokenUser")
const checkPermission = require('./checkPermission')
const sendVericationEmail = require("./mailer/sendVericationEmail")
const sendResetPasswordEmail= require("./mailer/sendResetPasswordEmail")
const createHash = require("./createHash")
const uploader= require("./cloudinary/uploader")

module.exports ={
    createJWT, 
    isTokenValid, 
    createTokenUser, 
    attachCookiesToresponse, 
    checkPermission, 
    sendVericationEmail,
    sendResetPasswordEmail,
    createHash,
    uploader

}