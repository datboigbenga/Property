const User = require("../models/User")
const customApiError = require("../errors")
const {StatusCodes} = require("http-status-codes")
const {createTokenUser, attachCookiesToresponse, checkPermission} = require("../utils")
const { BadRequestError } = require("../../Auth-levels/errors")

const getAllUsers = async(req, res)=>{
    const user = await User.find({role:"user"}).select("-password")
    res.status(StatusCodes.OK).json({users:user})
}

const getSingleUser = async(req, res)=>{
    const{id:userId} = req.params
    const user = await User.findOne({_id:userId}).select("-password")
    if(!user){
        throw new customApiError.notFound("user does not exist")
    }
    // console.log(req.user)
    checkPermission(req.user, user._id)
    res.status(StatusCodes.OK).json({users:user})
}

const showCurrentUser = async(req, res)=>{
    const user = req.user
    res.status(StatusCodes.OK).json({user:user})
}

const updateUser = async(req, res)=>{
    const {firstname, lastname, username, email}  = req.body
    if(!firstname || !lastname || !username || !email){
        throw new customApiError.BadRequestError("Please provide field parameters")
    }

    const user = await User.findOne({_id:req.user.userId})
    user.firstname = firstname;
    user.lastname = lastname;
    user.username = username;
    user.email = email;
    await user.save()
    const tokenUser = createTokenUser(user)
    attachCookiesToresponse({res, user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
    
}

const updateUserPassword = async(req, res)=>{
    const{oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword){
        throw new customApiError.BadRequestError("Please provide both fields")
    }
    const user = await User.findOne({_id:req.user.userId})
    
    const isPasswordCorrect = await user.comparePass(oldPassword)

    if(!isPasswordCorrect){
        throw new customApiError.BadRequestError("wrong password")
    }

    user.password = newPassword
    await user.save()
    res.status(StatusCodes.OK).json({msg: "password changed successfully"})
}

const deleteUserAccount = async(req, res)=>{
    const{id:userId} = req.params
    const user = await User.findOne({_id:userId})
    if(!user){
        throw new customApiError.notFound("user does not exist")
    }
    checkPermission(req.user, user._id)
    await user.remove()
    res.status(StatusCodes.OK).json({msg: "user deleted successfully"})
}


module.exports ={
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    deleteUserAccount
}