const mongoose = require("mongoose")

const PackagesSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, "must provide package name"],
        trim: true,
        unique:true
        // maxlength: [20, "maximum length must not be more than 20 characters "]
    }, 
    price:{
        type: Number,
        required:[true, "Please provide package price"],
        default:0,
    },
    description:{
        type: String,
        required:[true, "Please provide package description"],
        maxlength:[1000, "Description can not be more than 1000 characters"]
    },
    discount:{
        type:Number,
        default:0
    },
    expirationDate:{
        type:Number,
        required:[true, "Please provide expiration date in months"],
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("packages", PackagesSchema)