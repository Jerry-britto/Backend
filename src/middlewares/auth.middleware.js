import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJwt = asyncHandler(async(req,_,next)=>{
   try {
     //if request is sent through mobile there is a high chance that there are no cookies sent so we hancle the case for that as well
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ",""); //header: Bearer <tokens>
 
     if(!token){
        throw new  ApiError(401,"Unauthorized token")
     }
 
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
 
    const user =  await User.findById(decodedToken?._id).select("-password -refreshToken");

    if(!user){
     throw new ApiError(401,"Invalid access token");
    }
 
    req.user = user; //making user available in the request object
    
    next();
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid access");
   }
})