import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CredentialDto, LoginRequest, LoginResponse } from './credential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtExpiredException } from 'src/exceptions/jwt-expired.exception';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('credentials')
export class CredentialController {
  constructor(
    private readonly credentialService: CredentialService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async createCredential(@Body() credential: CredentialDto): Promise<string> {
    const message = await this.credentialService.create(credential);
    throw new HttpException(message, HttpStatus.CREATED);
  }

  @Post('login')
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const credential = await this.credentialService.validateUser(
      body.email,
      body.password,
    );
    if (!credential) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const payload = { email: credential.email };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });

    await this.credentialService.update({ email: credential.email, partUpdate: { refreshToken }});

    return { email: credential.email, accessToken, refreshToken };
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const refreshToken = body.refreshToken;

    let user;
    try {
      const payload = this.jwtService.verify(refreshToken);
      user = await this.credentialService.findUserByRefreshToken(refreshToken);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new JwtExpiredException();
      }
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const newAccessToken = this.jwtService.sign({ email: user.email });

    return { accessToken: newAccessToken };
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    if (this.credentialService.logout(token)) {
      return new HttpException('Logout successfully !', HttpStatus.OK);
    }

    return new HttpException('Logout failed !', HttpStatus.BAD_REQUEST);
  }
}
