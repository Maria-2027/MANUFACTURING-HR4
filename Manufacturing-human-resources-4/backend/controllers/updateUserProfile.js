// controllers/userController.js

import User from "../models/User.js";

export const updateUserProfile = async (req, res) => {
  const { username, email } = req.body;
  try {
    // Find user by ID and update their username and email
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { username, email },
      { new: true } // Return the updated document
    ).select('-password'); // Exclude password field

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error updating profile: ' + err.message,
    });
  }
};
