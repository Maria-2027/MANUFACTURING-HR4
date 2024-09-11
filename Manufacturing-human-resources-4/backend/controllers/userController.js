import User from "../models/userModel.js";

const getUser = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log("Error");
    throw new Error(error.message);
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = new User({
    name: name,
    email: email,
    password: password,
  });

  const getUser = await newUser.save();

  const user = await User.findById(getUser);

  res.status(201).json({ success: true, data: user });
};

export { getUser, registerUser };
