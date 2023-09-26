const  customApiError = require("./customError")
const {StatusCodes} = require("http-status-codes")

class Unauthorized extends customApiError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }

}

module.exports = Unauthorized