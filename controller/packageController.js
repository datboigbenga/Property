const Package = require("../models/Packages")
const {StatusCodes} = require("http-status-codes")
const customApiError = require("../errors")

const createPackage= async(req, res)=>{
const {name, price, description, discount, expirationDate} = req.body
if(!name || !price || !description || !expirationDate){
    throw new customApiError.BadRequestError("Fill in the firlds correctly")
}
const packageNameExists = await Package.findOne({name})
if(packageNameExists){
    throw new customApiError.BadRequestError("A Package with name already exists")    
}

const package = await Package.create({name, price, description, discount, expirationDate})
res.status(StatusCodes.CREATED).json({package})
}

const getAllPackage = async(req, res)=>{
    const package = await Package.find({})
    res.status(StatusCodes.OK).json({packages:package, nbHit:package.length})
}

const get_a_Package = async(req, res)=>{
    const {params:{id:packageId}} = req
    const package = await Package.findOne({_id:packageId})
    if(!package){
        throw new customApiError.notFound(`no package found with id: ${packageId}`)
    }
    res.status(StatusCodes.OK).json({package})
}

const update_a_Package = async(req, res)=>{
    const {params:{id:packageId}} = req
    const {name, price, description, discount, expirationDate} = req.body
    if(!name || !price || !description || !expirationDate){
        throw new customApiError.BadRequestError("Fill in the firlds correctly")
    }
    const package = await Package.findOneAndUpdate({_id:packageId}, req.body, {new:true,runValidators:true})
    if(!package){
        throw new customApiError.notFound(`no package found with id: ${packageId}`)
    }
    res.status(StatusCodes.OK).json({package})
}

const delete_a_Package = async(req, res)=>{
    const {params:{id:packageId}} = req
    const package = await Package.findOneAndDelete({_id:packageId})
    if(!package){
        throw new customApiError.notFound(`no package found with id: ${packageId}`)
    }
    res.status(StatusCodes.OK).json({msg: "package deleted successfully"})
}

module.exports={
    createPackage,
    getAllPackage,
    get_a_Package,
    update_a_Package,
    delete_a_Package
}