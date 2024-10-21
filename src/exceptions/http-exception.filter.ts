import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();

      switch (status) {
        case HttpStatus.FORBIDDEN:
          response.status(status).json({
            statusCode: status,
            message: 'Access denied. You do not have permission to perform this action.',
          });
          break;
        
        default:
          response.status(status).json({
            statusCode: status,
            message: exception.getResponse()
          });
      }
    }
  }
  