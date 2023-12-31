const express = require("express")
const router = express.Router()
const{register, login,logout, verifyEmail, forgotPassword, resetPassword} = require("../controller/authController")
const {auth, authorizePermissions} = require("../middleware/auth")
const rateLimiter = require('express-rate-limit');

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: 'Too many requests from this IP, please try again after 15 minutes',
  },
});


router.post("/register", register)
router.post("/login",  login)
router.delete("/logout", auth,  logout)
router.get("/verifyEmail", verifyEmail)
router.post("/forgotPassword", forgotPassword)
router.post("/resetPassword", resetPassword)
// router.patch("/updateadmin/:id", updateAdmin)


module.exports = router