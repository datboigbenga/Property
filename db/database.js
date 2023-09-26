const mongoose = require("mongoose")
const config = require("../config/config")
let MONGO_URI= `mongodb://${config.database.MONGODB_DOMAIN}/${config.database.MONGODB_DB_MAIN}`;

if (config.database.MONGODB_DB_USER && config.database.MONGODB_DB_PASS) {
  MONGO_URI = `mongodb://${config.database.MONGODB_DB_USER}:${config.database.MONGODB_DB_PASS}@${config.database.MONGODB_DOMAIN}/${config.database.MONGODB_DB_MAIN}`;
}


const connectDb = async()=>{
    // console.log(MONGO_URI, config)
    return mongoose.connect(MONGO_URI)
}

const closeDb = async () => {
    //   await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    };

module.exports ={connectDb, closeDb}