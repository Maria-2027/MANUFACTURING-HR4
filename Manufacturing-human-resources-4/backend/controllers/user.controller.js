import User from '../models/User.js'; 
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // ✅ Debugging

        const { username, firstname, lastname, email, phone, address, password, role } = req.body;

        // ✅ Ensure all fields are provided
        if (!username || !firstname || !lastname || !email || !phone || !address || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // ✅ Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create New User
        const newUser = new User({
            username,
            firstname,
            lastname,
            email,
            phone,
            address,
            password: hashedPassword,  // ✅ Save hashed password
            role
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
