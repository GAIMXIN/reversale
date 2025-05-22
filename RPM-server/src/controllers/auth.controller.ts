import asyncErrorHandler from '../middlewares/asyncErrorHandler.middleware';
import authValidation from '../validations/auth.validation';
import type { LoginData, SignupData } from '../types/auth.type';
import authService from '../services/auth.service';
import apiResponse from '../utils/apiResponse.utils';

const signup = asyncErrorHandler(async (req, res) => {
  const validatedData = authValidation.signup.validate(req.body) as SignupData;
  const newUser = await authService.signup(validatedData);

  res.status(201).json(apiResponse('Signup successfull', newUser));
});

const login = asyncErrorHandler(async (req, res) => {
  const validatedData = authValidation.login.validate(req.body) as LoginData;
  const user = await authService.login(validatedData);

  res.status(201).json(apiResponse('Login successfull', user));
});

export default { signup, login };
