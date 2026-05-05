import mongoose from "mongoose";
import { connect } from "mongoose";
const connectDB =()=>{
    mongoose.connect(process.env.DB_URL).then(()=>console.log('database is connected')).catch((e)=>{
        console.log(e.message);
    })


}

export default connectDB;