import User from '../models/userModel.js'; // Make sure to include the .js extension
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            email: user.email,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

export { authUser }; // Use named export
