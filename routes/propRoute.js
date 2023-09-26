const express = require("express")
const router = express.Router()
const {auth, authorizePermissions} = require("../middleware/auth")
const{postProperty, getAllProperty, getTopProperty, get_aProperty, updateProperty, deleteProperty} = require("../controller/propController")
const upload = require("../utils/multer")



router.route("/")
.get(getAllProperty)
.post(auth, upload.fields([
    {name:"coverImage", maxCount: 1},
    {name:"images", maxCount: 5}
])
, postProperty)

router.route("/top")
.get(getTopProperty)


router.route("/:id")
.get(get_aProperty)
.patch(auth, updateProperty)
.delete(auth, deleteProperty)



module.exports = router