import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const authMiddleware = async (req, res, next) => {
  let token = req.header("x-auth-token") || req.header("Authorization"); // Sinusubukan pareho

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Kung gumagamit ng 'Bearer token'
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1]; // Kukunin lang ang token value
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 // Ensure JWT_SECRET is from env file
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }

};

export default authMiddleware;
