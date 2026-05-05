import jwt from "jsonwebtoken";
import User from "../model/user.js";

const protect  = async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token || token===undefined){
    return res.status(401).json({message:"Not authroized or not token "})   ;    
    }
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        req.user = await User.findById(decode.id).select("-password");
        next();
    }
    catch(e){
        res.status(404).json(e.message);
    }
}

export default protect;