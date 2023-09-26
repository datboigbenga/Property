const User = require("../models/User")
const Token = require("../models/Token")
const {StatusCodes} = require("http-status-codes")
const {createTokenUser,attachCookiesToresponse, 
    sendVericationEmail, sendResetPasswordEmail, createHash} = require("../utils")
const customApiError= require("../errors")
const crypto =require("crypto")

const register= async(req, res)=>{

    const {firstname, lastname, email, password} = req.body
    const emailAlreadyExists = await User.findOne({email})

    if(emailAlreadyExists){
        throw new customApiError.BadRequestError("Email already exist")
    }
    
    const isFirstAccount = await User.countDocuments({})  === 0
    const role = isFirstAccount? "admin":"user";

    const verificationToken = crypto.randomBytes(40).toString("hex")


    const user = await User.create({firstname, lastname, email, role, password,  verificationToken});
    const tokenUser = createTokenUser(user)
    attachCookiesToresponse({res,user:tokenUser})
    const origin = `http://localhost:${process.env.PORT}`
    // console.log(origin)
    await sendVericationEmail({
        firstname:user.firstname, 
        email:user.email, 
        verificationToken:user.verificationToken,
        origin
    }); 
    res.status(StatusCodes.CREATED).json({msg: "Successfully created, please verify your email"})
}
 
const login= async(req, res)=>{
    const {email, password} = req.body

    if(!email || !password){
        throw new customApiError.BadRequestError("Please fill in the fields")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new customApiError.unauthenticated("User does not exist")
    }

    const isPasswordCorrect = await user.comparePass(password)

    if(!isPasswordCorrect){
        throw new customApiError.unauthenticated("invalid details")
    }
    if(!user.isVerified){
        throw new customApiError.unauthenticated("please verify your email")
    }
    const tokenUser = createTokenUser(user)

    let refreshToken = "";

    const existingToken = await Token.findOne({user:user._id})

    if(existingToken){
        const {isValid} = existingToken;
        if(!isValid){
            throw new customApiError.unauthenticated("Invalid Credentials")
        }

        refreshToken = existingToken.refreshToken
        attachCookiesToresponse({res,user:tokenUser, refreshToken:refreshToken})
        res.status(StatusCodes.OK).json({user:tokenUser})
        return;
    }

    
    refreshToken = crypto.randomBytes(40).toString("hex")

    const userAgent = req.headers["user-agent"]
    const ip = req.ip
    const userToken = {refreshToken, ip, userAgent, user:user._id}

    await Token.create(userToken)
    attachCookiesToresponse({res,user:tokenUser, refreshToken:refreshToken})
    res.status(StatusCodes.OK).json({user:tokenUser})
 }

const logout = async(req, res)=>{

    await Token.findOneAndDelete({user:req.user.userId});

    res.cookie("accessToken", "logout", {
        httpOnly:true,
        expires:new Date(Date.now())
    });

    res.cookie("refreshToken", "logout", {
        httpOnly:true,
        expires:new Date(Date.now())
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out  successfully!' });
}

const verifyEmail= async(req, res)=>{
    const {token:verificationToken, email} = req.query

    const user = await User.findOne({email:email})

    if(!user){
        throw new customApiError.unauthenticated("verification failed")
    }
    if(user.verificationToken !== verificationToken){
        throw new customApiError.unauthenticated("verification failed")
    }
    user.isVerified = true;
    user.verified = Date.now()
    user.verificationToken = ""
    await user.save()
    res.status(StatusCodes.OK).json({msg:'Email verified successfully'})
}

const forgotPassword = async(req, res)=>{
    const {email} = req.body;

    if(!email){
        throw new customApiError.BadRequestError("Please input your email")
    }
    const user = await User.findOne({email: email})
    if(user){
        const passwordToken = crypto.randomBytes(70).toString("hex")
        const tenMinutes = 60
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)
        const origin = `http://localhost:${process.env.PORT}`
        await sendResetPasswordEmail({
            username:user.username, 
            email:user.email, 
            passwordToken:passwordToken,
            origin
        })

        user.passwordToken = createHash(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate
        await user.save()
    }
    res.status(StatusCodes.OK).json({ msg: 'please check your email to reset password' });
}

const resetPassword = async(req, res)=>{
    const {token, email} = req.query
    const{ password} = req.body
    if(!token || !email || !password){
        throw new customApiError.BadRequestError("Please fill in the appropriate fields")
    }

    const user = await User.findOne({email:email})

    if(user){
        currentMoment = new Date()
        if(user.passwordToken === createHash(token) && user.passwordTokenExpirationDate > currentMoment){
            user.password = password;
            user.passwordToken = null;
            user.passwordTokenExpirationDate = null
             
            await user.save()
        }
    }

    res.status(StatusCodes.OK).json({ msg: 'password reset successfull' });
}





 module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,

}
