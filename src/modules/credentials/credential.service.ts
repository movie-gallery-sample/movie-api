import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialEntity } from './credential.entity';
import { Repository } from 'typeorm';
import { CredentialDto, LoginRequest, LoginResponse } from './credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { typeOf } from 'src/utils/typeOf';

@Injectable()
export class CredentialService {
  private static readonly blacklistedTokens: string[] = [];

  constructor(
    @InjectRepository(CredentialEntity)
    private readonly credentialRepository: Repository<CredentialEntity>,
    private jwtService: JwtService,
  ) {}

  async emailExists(email: string): Promise<boolean> {
    const countEmails = await this.credentialRepository.count({
      where: { email },
    });
    return countEmails > 0;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<CredentialEntity> {
    const credential = await this.credentialRepository.findOne({
      where: { email },
    });

    if (!credential) {
      throw new HttpException('Email does not exist !', HttpStatus.UNAUTHORIZED);
    }

    if (await bcrypt.compare(password, credential.password)) {
      return credential;
    }
    
    throw new HttpException('Wrong password !', HttpStatus.UNAUTHORIZED);
  }

  private addToBlacklist(token: string): void {
    CredentialService.blacklistedTokens.push(token);
    this.cleanUpBlacklistedTokens();
  }

  private cleanUpBlacklistedTokens(): void {
    const now = Date.now();
    const expiredTokens = CredentialService.blacklistedTokens.filter((t) => {
      const decodedToken = this.jwtService.decode(t);
      return (
        typeOf(decodedToken) === 'object' && decodedToken?.exp * 1000 < now
      );
    });

    expiredTokens.forEach((t) => {
      const index = CredentialService.blacklistedTokens.indexOf(t);
      if (index > -1) {
        CredentialService.blacklistedTokens.splice(index, 1);
      }
    });
  }

  static isInBlackList(token: string): boolean {
    return CredentialService.blacklistedTokens.includes(token);
  }

  async create(credential: CredentialDto): Promise<string> {
    try {
      const isExistedEmail = await this.emailExists(credential.email);
      const hashedPassword = await bcrypt.hash(
        credential.password,
        +process.env.SALT_ROUNDS,
      );

      if (isExistedEmail) {
        throw new HttpException('Email exists !', HttpStatus.BAD_REQUEST);
      }
      await this.credentialRepository.save({
        email: credential.email,
        password: hashedPassword,
      });
      return 'Created a new account successfully !';
    } catch (error) {
      throw new HttpException(
        error.message || 'Something went wrong',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(credential: { email: string; partUpdate: any }) {
    const credentialFinding = await this.credentialRepository.findOne({
      where: { email: credential.email },
    });
    if (!credentialFinding) {
      throw new HttpException('Credential not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(credentialFinding, credential.partUpdate);

    return this.credentialRepository.save(credentialFinding);
  }

  async findUserByRefreshToken(
    refreshToken: string,
  ): Promise<CredentialEntity | null> {
    return this.credentialRepository.findOne({ where: { refreshToken } });
  }

  async logout(token: string): Promise<boolean> {
    try {
        const { email } = this.jwtService.verify(token);
        const credential = await this.credentialRepository.findOneBy({ email });
    
        this.addToBlacklist(token);
        await this.credentialRepository.update(credential.email, { refreshToken: null });

        return true;
    } catch (error) {
        return false;
    }
  }
}
