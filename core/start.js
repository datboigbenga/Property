const port = process.env.PORT || 5000
const app = require("./app")
const db = require("../db/database")

const start = async()=>{
    try {
        await db.connectDb()
        app.listen(port, ()=>{console.log("server listening on port " + port +"...")})
    } catch (error) {
        console.log("unnable to connnect to database")
    }
}

module.exports = start
