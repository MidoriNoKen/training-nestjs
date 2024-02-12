import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  public catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception.getStatus();
    const error = 'Data not found!';
    const message = exception.message || 'Data not found!';

    return response.status(statusCode).json({
      statusCode,
      error,
      message,
    });
  }
}
