import { HttpException, HttpStatus } from '@nestjs/common';

export const HttpCommonException = ({
  message,
  httpStatus = HttpStatus.BAD_REQUEST,
}: {
  message: string;
  httpStatus?: HttpStatus;
}) => new HttpException(message || 'Something went wrong !', httpStatus);
