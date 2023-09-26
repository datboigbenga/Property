const  customApiError = require("./customError")
const {StatusCodes} = require("http-status-codes")

class Unaaccessible extends customApiError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.FORBIDDEN
    }

}

module.exports = Unaaccessible