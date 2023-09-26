const express = require("express")
const router = express.Router()
const {getAllUsers,
getSingleUser,
showCurrentUser,
updateUser,
updateUserPassword,
deleteUserAccount}= require("../controller/userController")

const {getPropertybyUser} = require("../controller/propController")

const{auth, authorizePermissions}= require("../middleware/auth")

router.route("/").get(auth, authorizePermissions("admin"),  getAllUsers)
router.route("/showMe").get(auth, showCurrentUser)
router.route("/updateUser").patch(auth, updateUser)
// router.post("/verifyEmail", verifyEmail);
router.route("/updateUserPassword").patch(auth, updateUserPassword)
router.route("/:id").get(auth,  getSingleUser)
router.route("/:id").delete(auth, deleteUserAccount)

router.route("/:id/property").get(auth, authorizePermissions("admin"),  getPropertybyUser)
module.exports = router