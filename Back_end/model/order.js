import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    item: {
         type:[]
    },
    address: {
        name: String,
        phone: String,
        addressLine: String,
        pincode: String
    },
    totalAmount: { type: Number },
    paymentMethod: String,     // COD / ONLINE
    paymentStatus: String,     // PENDING / SUCCESS
    orderStatus: String,       // PLACED / SHIPPED / DELIVERED
    date:String,
    createdAt: Date,
    deliveyAt:Date,
    deliveyed:Boolean,
})

const Order = mongoose.model("order",OrderSchema);
export default Order;