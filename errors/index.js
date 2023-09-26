const customApiError = require("./customError")
const BadRequestError = require("./badRequest")
const unauthenticated = require("./unauthorized")
const unaccessible = require("./unaccessible")
const notFound = require("./not_found")
const MulterError = require("./multerError")


module.exports = {
    customApiError,
    BadRequestError,
    unauthenticated,
    unaccessible,
    notFound,
    MulterError
}
