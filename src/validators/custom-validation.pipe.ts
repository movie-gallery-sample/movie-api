import { Injectable, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  protected exceptionFactory = (errors: ValidationError[] = []): BadRequestException => {
    // If there are validation errors, return only the first one
    const message = errors.length > 0 ? this.formatErrors(errors[0]) : 'Validation failed';
    return new BadRequestException(message);
  };

  private formatErrors(error: ValidationError): string {
    // Customize this method to format the error message as needed
    const constraints = error.constraints;
    return constraints ? Object.values(constraints)[0] : 'Validation error';
  }
}
