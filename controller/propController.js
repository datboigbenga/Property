const Property = require("../models/Property")
const path = require("path")
const {StatusCodes} = require("http-status-codes")
const {BadRequestError} = require("../errors")
const user = require("../models/User")
const Subscriptions = require("../models/Subscriptions")
const fs = require("fs")
const {uploader} = require("../utils")


const postProperty = async(req, res)=>{
    const {name, category, features, description, location, price, phone} = req.body
    if(!name || !category || !features || !description|| !location || !price || !phone){
        throw new BadRequestError("fill in the fields correctly")
    }
    if(!req.files.coverImage){
        throw new BadRequestError("No cover image uploaded")
    }
    if(!req.files.images || req.files.images>5){
        throw new BadRequestError("images field required and shouldn't be more than 5")
    }
    

    const coverImageFile = req.files.coverImage[0]
    // const coverImageResult = await uploader(coverImageFile.path, "property_post/coverImages")
    // const coverImage = coverImageResult.secure_url
    fs.unlinkSync(coverImageFile.path);
    

    const images = [];
    const image_get = req.files.images
    for(const img of image_get){ 
        // const imageResult = await uploader(img.path, "property_post/images")
        // images.push(imageResult.secure_url)
        fs.unlinkSync(img.path);
    }

    const property = await Property.create({name, category, features, description, location, price, phone, coverImage: "coverImage", images: "images", postedBy:req.user.userId})
    res.status(StatusCodes.CREATED).json({property})    
}

const getAllProperty = async(req, res)=>{
    const {search, category, priceFilters}  = req.query
    const queryObject = {};
    if(search){
        queryObject.name = {$regex:search, $options:'i'};
        queryObject.features = {$regex:search, $options:'i'}
    } 
    if(category){
        queryObject.category = category
    } 
    if (priceFilters) {
        const operatorMap = {
          '>': '$gt',
          '>=': '$gte',
          '=': '$eq',
          '<': '$lt',
          '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = priceFilters.replace(
          regEx,
          (match) => `-${operatorMap[match]}-`
        );
        const options = ['price'];
        filters = filters.split(',').forEach((item) => {
          const [field, operator, value] = item.split('-');
          if (options.includes(field)) {
            queryObject[field] = { [operator]: Number(value) };
          }
        });
      }
    let result =  Property.find(queryObject)

    result = result.sort("-sDate -createdAt")
    const page = Number(req.query.page) || 1;
    const  limit = Number(req.query.limit) || 15;
    const skip = (page - 1)*limit;

    result = result.skip(skip).limit(limit)

    const property = await result;
    res.status(StatusCodes.OK).json({property, count:property.length})
}

const getTopProperty = async(req, res)=>{
    const {search, category,  priceFilters}  = req.query
    const queryObject = {active:true};
    if(search){
        queryObject.name = {$regex:search, $options:'i'}
    } 
    if(category){
        queryObject.category = category
    } 
    let result =  Property.find(queryObject)

    result = result.sort("-active sDate createdAt")
    const page = Number(req.query.page) || 1;
    const  limit = Number(req.query.limit) || 15;
    const skip = (page - 1)*limit;

    result = result.skip(skip).limit(limit)

    const property = await result;
    res.status(StatusCodes.OK).json({property, nbHit:property.length})
}

const get_aProperty = async(req, res)=>{
    const {params:{id:propertyId}} = req
    const property = await Property.findOne({_id:propertyId})
    if(!property){
        throw new notFound(`no post found with id: ${propertyId}`)
    }
    res.status(StatusCodes.OK).json({property, nbHit: property.length})
}

const getPropertybyUser = async(req, res)=>{
    const {params:{id:userId}} = req
    const property = await Property.findOne({postedBy: userId})
    if(!property){
        throw new notFound(`no post found by user with id: ${userId}`)
    }
    res.status(StatusCodes.OK).json({property, nbHit: property.length})
}



const updateProperty = async(req, res)=>{
    const {
        body: {name, category, features, description, location, price, phone},
        params:{id: propertyId},
    } = req

    if(!name || !category || !features || !description || !location || !price || !phone){
        throw new BadRequestError("Pleae fill in the fields")
    }

    const property = await  Property.findByIdAndUpdate({_id: propertyId}, req.body, {new:true,runValidators:true})

    if(!property){
        throw new notFound(`no result  wit id:  ${propertyId}`)
    }
    res.status(StatusCodes.OK).json({property})

}

const deleteProperty = async(req, res)=>{
    const {
        user:{userId},
        params:{id:propertyId}
    }= req
    
    const property = await Property.findByIdAndRemove({_id:propertyId})
    // const property = await Property.deleteMany({})
    
    if(!property){
        throw new notFound(`no records with id: ${propertyId}`)
    }
    res.status(StatusCodes.OK).send()
}


module.exports = {
getAllProperty,
getTopProperty,
get_aProperty,
getPropertybyUser,
postProperty,
updateProperty,
deleteProperty
}



   