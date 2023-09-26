const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required: [true, 'please provide a name'],
        minlength: 3,
        maxlength: 50
    },
    lastname:{
        type:String,
        required: [true, 'please provide a name'],
        minlength: 3,
        maxlength: 50
    },
    email:{
        type:String,
        required: [true, 'please provide an email'],
        minlength: 3,
        maxlength: 50,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        unique: true
    },
    
    password:{
        type:String,
        required: [true, 'please provide your password'],
        minlength: 3,
    },

    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    verificationToken: String,
    isVerified:{
        type:Boolean,
        default:false
    },
    verified:Date
        
})

UserSchema.pre("save", async function(){
    if(!this.isModified('password')) return; 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePass = async function(inputtedPass){
    const ismatch = bcrypt.compare(inputtedPass, this.password)
    return ismatch
}

module.exports = mongoose.model("users", UserSchema)