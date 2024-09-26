import express from 'express'; 
import { authUser } from '../controllers/userController.js';

const UserRouter = express.Router();

UserRouter.post('/login', authUser); 


export default UserRouter;
