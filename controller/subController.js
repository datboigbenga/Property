const Order = require("../models/Order")
const Packages = require("../models/Packages")
const Subscriptions = require("../models/Subscriptions")
const {StatusCodes} = require("http-status-codes")
const customApiError = require("../errors")
const {checkPermission} = require("../utils")
const calcDate = require("../utils/date")


const createSub = async(req, res)=>{
    const{order:orderId}= req.body
    const subscriptionExists = await Subscriptions.findOne({user:req.user.userId, status:"active"})
    if(subscriptionExists){
      throw new customApiError.BadRequestError("You have an active subscription")
    }
    console.log(subscriptionExists)
    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new customApiError.notFound(`no order with id: ${orderId}`)
    }
  
    if(order.status != "paid"){
        throw new customApiError.unaccessible("unable to access routeee")
    }
    
   const package = await Packages.findOne({_id:order.package})
   const startDate = new Date()
   const expiryDate = calcDate(package.expirationDate) 
 
   const subscription = await Subscriptions.create({
     package: order.package,
     order: order._id,
     status: "active",
     startDate: startDate,
     expiryDate: expiryDate,
     user: req.user.userId
   })
   order.status = "canceled"
   await order.save()
    checkPermission(req.user, order.user);
    res.status(StatusCodes.CREATED).json({subscription})
}

const getSub = async(req,res)=>{
    const subscription = await Subscriptions.find({})
    res.status(StatusCodes.OK).json({subscriptions:subscription, count:subscription.length})
           
}

module.exports = {
    createSub,
    getSub
}