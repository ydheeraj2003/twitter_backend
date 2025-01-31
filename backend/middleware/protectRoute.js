import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const protectRoute =async(req,res,next) => {
    try 
    {
        const token=req.cookies.jwt;
        if (!token)
        {
            return res.status(401).json({error : "Unauthorised, no token provided"});
        }
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded)
        {
            return res.status(401).json({error : "token invalid"});
        }
        const user=await User.findById(decoded.userId).select("-password");
        if (!user)
        {
            return res.status(401).json({error: "user not found"});
        }
        req.user=user;
        next();
    }
    catch(error)
    {
        return res.status(400).json({error : "internal server error"});
    }
}