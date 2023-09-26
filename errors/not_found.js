const  customApiError = require("./customError")
const {StatusCodes} = require("http-status-codes")

class notFound extends customApiError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND
    }

}

module.exports = notFound;