import express from 'express';
import { requestBudget, updateBudgetRequest, getAllBudgetRequests } from '../controllers/budgetRequestController.js';
import upload from '../config/multerConfig.js';

const budgetrequestRoute = express.Router();

budgetrequestRoute.post('/request-budget', requestBudget);
budgetrequestRoute.post('/updateStatusFinance', updateBudgetRequest);
budgetrequestRoute.get('/get-all', getAllBudgetRequests);



export default budgetrequestRoute;  