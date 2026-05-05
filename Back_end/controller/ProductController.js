import product from "../model/product.js";
import Product from "../model/product.js";
import asyncHandler from "express-async-handler";


//get all product for home page
const getAll = asyncHandler(async(req,res)=>{
    const product=await Product.find({}); 
    if(!product) {
         throw new Error('some error')
         return;
    }
    return res.status(200).json(product);
})

//get single product
const getSingle = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
        return res.status(400).json("product is deleted by the ower");
    }
    return res.status(200).json(product);
})

//search product by name
const searchByname = asyncHandler(async(req,res)=>{
    const {name} = req.params;
    const product = await Product.find({name:{$regex:name,$options:'i'}})
    if(!product){
    return res.status(404).json("not found")
}
return   res.status(200).json(product);
})


export{getAll,getSingle,searchByname}