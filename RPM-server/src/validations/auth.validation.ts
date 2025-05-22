import Joi from 'joi';
import validationHelper from '../utils/validationHelper.utils';

const signup = new validationHelper({
  first: Joi.string().min(3).required(),
  last: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.valid('doctor', 'patient'),
});

const login = new validationHelper({
  email: signup.schema.extract('email'),
  password: signup.schema.extract('password'),
});

export default {
  signup,
  login,
};
