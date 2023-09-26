const {customApiError, MulterError} = require("../errors")
const {StatusCodes}= require("http-status-codes")
const errorHandler = (err, req, res, next)=>{
    // console.log(err)

    let customError = {
        statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "something went wrong try again later"
    }

    if (err instanceof MulterError){
        customError.statusCode = StatusCodes.BAD_REQUEST,
        customError.msg = err.message  
    }

    if (err.name === "ValidationError"){
        customError.msg = Object.values(err.errors)
         .map((items)=> { return items.message})
         .join(" and "),
        customError.statusCode = 400
    }

    if (err.name === "CastError"){
        customError.msg = `invalid id, ${err.value}`,
        customError.statusCode = 404
    }

    if(err.code && err.code==11000){
        customError.msg = `Duplicate details for ${Object.keys(err.keyValue)} try another`,
        customError.statusCode = 400
    }
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err})
    // res.status(customError.statusCode).json({msg:err})
    // console.log(err)
    res.status(customError.statusCode).json({msg:customError.msg})
    next()
}

module.exports = errorHandler