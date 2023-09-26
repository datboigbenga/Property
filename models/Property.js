const mongoose = require("mongoose")

const PropertySchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, "must provide property name"],
        trim: true,
        // maxlength: [20, "maximum length must not be more than 20 characters "]
    }, 
    category:{
        type: String,
        enum: ['houses', 'lands', 'rentals','short-let'],
        required: [true, "Must provide type of property"],
    },
    features:{
        type: [String],
        required: true
    },
    description:{
        type:String,
        required: [true, "must give discription of property"],
    },
    location:{
        type:String,
        required: [true, "Location of property must be provided"],
    },
    price:{
        type:Number,
        required: [true, "Price of property must be provided"],
        default: 0,
    },
    phone:{
        type: String,
        required: [true, "provide phone of vendor"],
    },
    coverImage:{
        type:String,   
        required: true,
    },
    images:{
        type:Array,   
        required: true,
    },
    active:{
        type:Boolean,
        default:false
    },
    sDate:{
        type:Date
    },
    eDate:{
        type:Date
    },
    postedBy:{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: [true, 'Please provide user'],
    },
},
    { timestamps: true }
)


PropertySchema.post("save", async function(next){
    let sub = await this.model("subscriptions").findOne({user:this.postedBy, status:"active"})
    console.log(sub, this.get("user"))
    if(sub){
                this.active= true;
                this.sDate = sub.startDate
                this.eDate = sub.expiryDate
                await property.save()   
    }
    else{return}
    
})
module.exports = mongoose.model("property", PropertySchema)