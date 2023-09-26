const Order = require("../models/Order")
const Packages = require("../models/Packages")
const Subscriptions = require("../models/Subscriptions")
const {StatusCodes} = require("http-status-codes")
const customApiError = require("../errors")
const {checkPermission} = require("../utils")
const calcDate = require("../utils/date")

const fakeStripeAPI = async(amount, currency)=>{
    const client_secret = "payment recieved"
    return {amount, client_secret}
}  

const createOrder = async(req, res)=>{
    const {package:packageId} = req.body

    console.log(packageId)
    const subscriptionExists = await Subscriptions.findOne({user:req.user.userId})
    if(subscriptionExists && subscriptionExists.status == "active"){
      throw new customApiError.BadRequestError("You have an active subscription")
    }
    const package = await Packages.findOne({_id:packageId})
    const {_id, name, price, description, discount, expirationDate} = package

    const paymentIntent = await fakeStripeAPI({
        amount: price,
        currency:"usd"
      })

    const order = await Order.create({
        package:packageId,
        amount:price,
        user: req.user.userId,
        clientSecret: paymentIntent.client_secret,
    })

    res.status(StatusCodes.CREATED).json({order, clientSecret: order.clientSecret })
}

const getAllOrders = async(req, res)=>{
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({orders, count:orders.length})
     
}

const updateOrder = async(req, res)=>{
    const{id:orderId} = req.params;
    const { paymentIntentId } = req.body;
    const order = await Order.findOne({_id:orderId})
    if(!order){
      throw new customApiError.notFound(`No order with id: ${orderId}`)
    }
    checkPermission(req.user, order.user);
  
    order.paymentIntentId = paymentIntentId;
    order.status = "paid"
    const pack = order.package
    await  order.save()

   res.status(StatusCodes.OK).json({order})
}

module.exports={
  createOrder,
  getAllOrders,
  updateOrder
}