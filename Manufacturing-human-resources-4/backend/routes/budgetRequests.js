import express from 'express';
import { requestBudget, updateBudgetRequest } from '../controllers/budgetRequestController.js';
import upload from '../config/multerConfig.js';

const budgetrequestRoute = express.Router();

budgetrequestRoute.post('/request-budget', requestBudget);
budgetrequestRoute.post('/updateStatusFinance', updateBudgetRequest);


export default budgetrequestRoute;