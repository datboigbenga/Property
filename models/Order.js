const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    package: {
        type: mongoose.Schema.ObjectId,
        ref: 'packages',
        required: true,
      },
      amount:{
        type:Number,
        required: true
      },
    status:{
        type:String,
        enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
        default: 'pending',
       },
       user:{
        type:mongoose.Schema.ObjectId,
        ref: "users",
        required:true
       },
       clientSecret:{
        type:String,
        required:true
       },
       paymentIntentId:{
        type:String
       }
},
    { timestamps: true }
)

module.exports = mongoose.model("orders", OrderSchema)