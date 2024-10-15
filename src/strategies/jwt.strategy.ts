import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CredentialEntity } from 'src/modules/credentials/credential.entity';
import { CredentialService } from 'src/modules/credentials/credential.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private credentialService: CredentialService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { email: string }): Promise<CredentialEntity> {
    return this.credentialService.validateUser(payload.email, null);
  }
}
