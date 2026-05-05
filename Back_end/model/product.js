import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
    { name: { type: String, required: true }, 
    imageURL: { type: String }, 
    description: { type: String }, 
    quantity: { type: Number, default: 0 }, 
    review: { type: Array, default: [] }, 
    rating: { type: Number, default: 0 }, 
    price: { type: Number }
 }); 

 const product = mongoose.model("product",productSchema);

 export default product;