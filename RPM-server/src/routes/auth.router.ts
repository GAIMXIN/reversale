import express, { Router } from 'express';
import authController from '../controllers/auth.controller';

const authRouter: Router = express.Router();

authRouter.route('/signup').post(authController.signup);
authRouter.route('/login').post(authController.login);

export default authRouter;
