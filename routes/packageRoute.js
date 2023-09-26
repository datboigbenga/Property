const express = require("express")
const router = express.Router()
const {auth, authorizePermissions} = require("../middleware/auth")
const{createPackage, getAllPackage, get_a_Package, update_a_Package, delete_a_Package} = require("../controller/packageController")
const upload = require("../utils/multer")



router.route("/")
.get(getAllPackage)
.post(auth, authorizePermissions("admin") , createPackage)


router.route("/:id")
.get(get_a_Package)
.patch(auth, authorizePermissions("admin"), update_a_Package)
.delete(auth, authorizePermissions("admin"), delete_a_Package)



module.exports = router