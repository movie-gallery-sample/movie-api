import { HttpException, HttpStatus } from '@nestjs/common';

export class JwtExpiredException extends HttpException {
  constructor() {
    super('Token has expired', HttpStatus.UNAUTHORIZED);
  }
}