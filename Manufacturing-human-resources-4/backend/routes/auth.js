import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const authMiddleware = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(" ")[1]
             }
        if (!token){
            return res.status(401).json({
                success: false,
                message: 'Not Authories'
            })
        }
        try{
            const decoded = jwt.verify(token, process.env.SERVICE_JWT_SECRET)

            const user = await User.findById(decoded.userId).select('-password')

            if (!user){
                return res.status(401),json({
                    success: false,
                    message: 'user not found'
                })
            }

            req.user = user 
            next()
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not Authorized, Token Failed'})
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error'})
    }
};



