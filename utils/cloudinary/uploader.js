const cloudinary = require("./cloudinaryConfig")

const uploader = async(fileLocation, folderPath)=>{
     const result = await cloudinary.uploader.upload(fileLocation,{
        use_filename:true,
        folder: folderPath
    })
    return result;
}

module.exports = uploader