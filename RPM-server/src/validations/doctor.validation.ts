import Joi from 'joi';
import validationHelper from '../utils/validationHelper.utils';

const addPatientData = new validationHelper({
  type: Joi.string()
    .valid('bloodPressure', 'heartRate', 'oxygenLevel', 'temperature', 'weight')
    .required(),
  value: Joi.string().min(1).required(),

  readingTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .message('readingTime must be in HH:mm 24-hour format')
    .required(),
  readingDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .message('readingDate must be in YYYY-MM-DD format')
    .required(),

  meals: Joi.string().valid('Before meal', 'After meal', 'Not applicable').required(),
  notes: Joi.string().optional(),
});

export default {
  addPatientData,
};
