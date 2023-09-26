const mongoose = require("mongoose")

const SubscriptionSchema = new mongoose.Schema({
    package:{
        type:mongoose.Schema.ObjectId,
        ref: "packages",
        required:true
       },
    order:{
        type:mongoose.Schema.ObjectId,
        ref: "orders",
        required:true
       },
    status:{
        type:String,
        enum: ['active', 'pending', 'expired'],
        default: 'pending',
       },
    startDate:{
        type:Date,
        required:[true, "Please provide expiration date in months"],
    },
    expiryDate:{
        type:Date,
        required:[true, "Please provide expiration date in months"],
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: [true, 'Please provide user'],
    }
},
    { timestamps: true }
)

SubscriptionSchema.post("save", async function(next){
    let sub = await this.model("subscriptions").findOne({user:this.user, status:"active"})
    // console.log(sub, this.get("user"))
    let pro  = await this.model("property").find({postedBy:this.user})
    for(let i=0; i<pro.length; i++){
        if(sub){
                // console.log(pro[i].active)
                pro[i].active = true;
                await pro[i].save()
            }
            else{
                // return
                pro[i].active = false;
                await pro[i].save()
            }
    }
    
})


module.exports = mongoose.model("subscriptions", SubscriptionSchema)