import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
// const authUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (user && (await user.matchPassword(password))) {
//         res.status(200).json({ success: true,
//             _id: user._id,
//             username: user.username,
//             firstname: user.firstname,
//             lastname: user.lastname,
//             email: user.email,
//             phone: user.phone,
//             address: user.address,
//             role: user.role,
//             token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
//             message: 'Login successful'
//         });
//     } else {
//         res.status(401);
//         throw new Error('Invalid email or password');
//     }
// });

const generateToken= (user) => {
    const payload = {
        userId: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
    };

    return jwt.sign(payload,process.env.SERVICE_JWT_SECRET,{
        expiresIn: '30d'
    });
};

export const login = async (req, res) => {

   try {
    const { username , password } = req.body;

    const user = await User.findOne({username});
    if(!user || !(await bcrypt.compare(password, user.password))){
       return res.status(401).json({success: false ,message: 'Invalid Credentials' });
    }

    const accessToken = generateToken(user);
    res.cookie ('accessToken',accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 
    });

    await user.save();

    res.json({success: true, message: 'Successfully Login', 
        accessToken, 
        user:{
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,

    }, 
});
   } catch (error) {
    return res.status(500).json({success: false , message: 'Internat server error'})
    
   }

}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (Requires Token)
//  export const getUserProfile = asyncHandler(async (req, res) => {
//     const user = await User.findById(req.user.id).select('-password'); // Exclude password

//     if (user) {
//         res.json(user);
//     } else {
//         res.status(404);
//         throw new Error("User not found");
//     }
// });


export const getUserProfile = async (req, res) => {
    try{
        const userId = req.user._id;
        const user = await User.findById(userId).select('-password');
        if(!user) {
           return res.status(404).json({
            success: false,
            message: 'User not Found',
            });
        }

        return res.status(200).json({success: true, data: user,});

    }catch(error){
        res.status(500).json({ success: false, message: "Internal Server Error "});
    }
}

// export { authUser, getUserProfile };
