
const express = require("express")
const router = express.Router()
const {auth, authorizePermissions} = require("../middleware/auth")
const{ createOrder, getAllOrders, updateOrder} = require("../controller/orderController")




router.route("/")
.get(auth, getAllOrders)
.post(auth, createOrder)


router.route("/:id")
// .get(get_a_Package)
.patch(auth, updateOrder)
// .delete(auth, authorizePermissions("admin"), delete_a_Package)


module.exports = router