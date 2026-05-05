import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    item:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product'
            },
            quantity:{
                type:Number,
                require:true,
                default:1
            },
            price:{type:Number}
        }
    ]
},{
    timestamps:true
})

const Cart = mongoose.model("cart",CartSchema);

export default Cart;
