import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CredentialService } from './credential.service';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly credentialService: CredentialService,
    private jwtService: JwtService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) return false;

    if (CredentialService.isInBlackList(token)) {
      return false;
    }

    try {
      const payload = this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}
