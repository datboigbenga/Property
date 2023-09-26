// express
const express = require("express")
const app = express()

// security packages
const rateLimiter = require("express-rate-limit")
const cors = require("cors")
const helmet = require("helmet")
const xss = require("xss-clean")
const mongoSanitize = require("express-mongo-sanitize")
const {expiredSubscriptions} = require("../cronJobs/job")

// otherpackages
const cookiePaser = require("cookie-parser")

// router
const Authroute  = require("../routes/authRoute")
const Userroute  = require("../routes/userRoute")
const Proproute = require("../routes/propRoute")
const Packageroute = require("../routes/packageRoute")
const Orderroute = require("../routes/orderRoute")
const Subroute = require("../routes/subRoute")

// middleware
const notFound = require("../middleware/not-found")
const errorHandler = require("../middleware/errorHandler")


app.use(express.static("./public"))
app.use("/uploads",express.static("uploads"))
app.use(cookiePaser(process.env.JWT_SECRET))
app.use(express.urlencoded({extended:false}))
app.use(express.json())



app.use("/api/v1/auth", Authroute)
app.use("/api/v1/user", Userroute)
app.use("/api/v1/property", Proproute)
app.use("/api/v1/package", Packageroute)
app.use("/api/v1/order", Orderroute)
app.use("/api/v1/subscription", Subroute)

app.use(notFound)
app.use(errorHandler)

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

module.exports = app;
