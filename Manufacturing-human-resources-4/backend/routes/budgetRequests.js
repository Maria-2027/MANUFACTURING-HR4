import express from "express";
import BudgetRequest from "../models/BudgetRequest.js";

const router = express.Router();

router.post('/', async (req, res) => {
    try {
      const newRequest = new BudgetRequest(req.body);
      await newRequest.save();
      res.status(201).json(newRequest);  // Return the saved budget request as a response
    } catch (error) {
      res.status(500).json({ message: 'Error creating budget request', error });
    }
  });
  
  export default router;
