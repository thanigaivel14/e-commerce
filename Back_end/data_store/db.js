import mongoose from "mongoose";
import { connect } from "mongoose";
import seedProduct from "../controller/dummyAPi.js";
const connectDB =()=>{
    mongoose.connect(process.env.DB_URL).then(()=> console.log("database connected")).catch((e)=>{
        console.log(e.message);
    })


}

export default connectDB;