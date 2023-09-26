require("dotenv").config()
const NODE_ENV = process.env.NODE_ENV || 'development';

const test= {
  port: process.env.PORT || 3000,
  database: {
    MONGODB_DOMAIN: process.env.MONGODB_DOMAIN || 'localhost:17017',
    MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || 'property_test',
    MONGODB_DB_USER: process.env.MONGODB_DB_USER || '',
    MONGODB_DB_PASS: process.env.MONGODB_DB_PASS || ''
  },
  log: {
    enable: !!(process.env.LOGS || true),
    MONGODB_URI: process.env.LOGS_MONGODB_URI || 'mongodb://localhost:17017/',
    MONGODB_DB_MAIN: process.env.LOGS_MONGODB_DB_MAIN || 'property_test'
  },
  cloudinary:{
    CLOUD_NAME : process.env.CLOUD_NAME,
    CLOUD_API_KEY : process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET : process.env.CLOUD_API_SECRET,
  },
  JWT_SECRET : process.env.JWT_SECRET,
  JWT_LIFETIME : process.env.JWT_SECRET
 

};

const development= {
  port: process.env.PORT || 3000,
  database: {
    MONGODB_DOMAIN: process.env.MONGODB_DOMAIN || 'localhost:17017',
    MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || 'property',
    MONGODB_DB_USER: process.env.MONGODB_DB_USER || '',
    MONGODB_DB_PASS: process.env.MONGODB_DB_PASS || ''
  },
  log: {
    enable: !!(process.env.LOGS || true),
    MONGODB_URI: process.env.LOGS_MONGODB_URI || 'mongodb://localhost:17017/',
    MONGODB_DB_MAIN: process.env.LOGS_MONGODB_DB_MAIN || 'property'
  },
  cloudinary:{
    CLOUD_NAME : process.env.CLOUD_NAME,
    CLOUD_API_KEY : process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET : process.env.CLOUD_API_SECRET,
  },
  JWT_SECRET : process.env.JWT_SECRET,
  JWT_LIFETIME : process.env.JWT_SECRET
};

const production= {
  port: process.env.PORT || 3000,
  database: {
    MONGODB_DOMAIN: process.env.MONGODB_DOMAIN || 'production_uri',
    MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || 'property',
    MONGODB_DB_USER: process.env.MONGODB_DB_USER || 'user',
    MONGODB_DB_PASS: process.env.MONGODB_DB_PASS || '123'
  },
  log: {
    enable: !!(process.env.LOGS || true),
    MONGODB_URI: process.env.LOGS_MONGODB_URI || 'mongodb://production_uri/',
    MONGODB_DB_MAIN: process.env.LOGS_MONGODB_DB_MAIN || 'property'
  },
  cloudinary:{
    CLOUD_NAME : process.env.CLOUD_NAME,
    CLOUD_API_KEY : process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET : process.env.CLOUD_API_SECRET,
  },
  JWT_SECRET : process.env.JWT_SECRET,
  JWT_LIFETIME : process.env.JWT_SECRET
  };

const config = { development, production, test };

module.exports= config[NODE_ENV];
