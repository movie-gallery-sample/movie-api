import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
import { typeOf } from 'src/utils/typeOf';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      switch (status) {
        case HttpStatus.UNAUTHORIZED:
          const messageUnauthorized = typeOf(exceptionResponse) === 'string'
            ? exceptionResponse
            : 'Your token is expired !';

          response.status(status).json({
            statusCode: status,
            message: messageUnauthorized,
          });
          break;

        case HttpStatus.FORBIDDEN:
          response.status(status).json({
            statusCode: status,
            message: 'Access denied. You do not have permission to perform this action.',
          });
          break;
        
        default:
          const messageDefault = typeOf(exceptionResponse) === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || exceptionResponse;

          response.status(status).json({
            statusCode: status,
            message: messageDefault,
          });
      }
    }
  }
  