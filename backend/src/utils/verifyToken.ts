import jwt from "jsonwebtoken";
import { AppError } from "./AppError";
import { DecodedUser } from "./exports";


export const verifyToken = (token : string , secret : string)=>{
    try {
        const decoded = jwt.verify(token,secret) as DecodedUser
        if (!decoded) throw new AppError(401,"Token missing user ID")
        return decoded
    } catch (error) {
        throw new AppError(401,"Invalid or expired token")
    }
    
}