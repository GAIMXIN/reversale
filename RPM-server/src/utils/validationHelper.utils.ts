import Joi, { Schema, ValidationErrorItem } from 'joi';
import CustomError from './customError.utils';

class validationHelper {
  public schema: Schema | Record<string, any>;
  constructor(validationSchema: Schema | Record<string, any>) {
    if (Joi.isSchema(validationSchema)) this.schema = validationSchema;
    else this.schema = Joi.object(validationSchema);
  }

  public validate(requestData: object) {
    const { value, error } = this.schema.validate(requestData, { abortEarly: false });

    if (error) {
      const formattedErrors = this.formatValidationErrors(error.details);
      throw new CustomError('Validation Failed', 400).setDetails(formattedErrors);
    }
    return value;
  }

  private formatValidationErrors(errorDetails: ValidationErrorItem[]): Record<string, string> {
    return errorDetails.reduce((errorObject: Record<string, string>, currentError) => {
      const fieldName = currentError.context?.label || String(currentError.path?.[0]) || 'unknown';
      const errorMessage = this.formatErrorMessage(currentError);
      errorObject[fieldName] = errorMessage;
      return errorObject;
    }, {});
  }

  private formatErrorMessage(errorDetail: ValidationErrorItem) {
    let message = errorDetail.message.replace(/"/g, '');
    return message.charAt(0).toUpperCase() + message.slice(1);
  }
}

export default validationHelper;
