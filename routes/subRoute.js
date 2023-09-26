const express = require("express")
const router = express.Router()
const {auth, authorizePermissions} = require("../middleware/auth")


const {createSub, getSub} = require("../controller/subController")


router.route("/")
.get(auth, getSub)
.post(auth, createSub)


// router.route("/:id")
// .get(get_a_Package)
// .patch(auth, updateOrder)
// .delete(auth, authorizePermissions("admin"), delete_a_Package)


module.exports = router