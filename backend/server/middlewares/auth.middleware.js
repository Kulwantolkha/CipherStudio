import jwt from "jsonwebtoken";
import User from "../models/User.model.js"

export const protect = async (req,res, next) => {
    try {
        const token = req.headers.authorization;

        if(!token) {
            return res.json({success: false, message: "Unauthorized - No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.json({success: false, message: "User not found"});
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Auth middleware error: ", error.message);
        return res.json({success: false, message: `Not authorized: ${error.message}`});
    }
}