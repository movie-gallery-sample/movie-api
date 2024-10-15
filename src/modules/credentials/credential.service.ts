import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CredentialEntity } from "./credential.entity";
import { Repository } from "typeorm";
import { CredentialDto, LoginRequest, LoginResponse } from "./credential.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class CredentialService {
    constructor(
        @InjectRepository(CredentialEntity)
        private readonly credentialRepository: Repository<CredentialEntity>
    ) {}

    async emailExists(email: string): Promise<boolean> {
        const countEmails = await this.credentialRepository.count({ where: { email } });
        return countEmails > 0;
    }

    async validateUser(email: string, password: string): Promise<CredentialEntity | null> {
        const credential = await this.credentialRepository.findOne({ where: { email } });
        if (credential && await bcrypt.compare(password, credential.password)) {
            return credential;
        }
        return null;
    }

    async create(credential: CredentialDto): Promise<string> {
        try {
            const isExistedEmail = await this.emailExists(credential.email);
            const hashedPassword = await bcrypt.hash(credential.password, 10);
            
            if (isExistedEmail) {
                throw new HttpException('Email exists !', HttpStatus.BAD_REQUEST);
            }
            await this.credentialRepository.save({ email: credential.email, password: hashedPassword });
            return "Created a new account successfully !";
        } catch (error) {
            throw new HttpException(error.message || 'Something went wrong', HttpStatus.BAD_REQUEST);
        }
    }

    async update(credential: {email: string, partUpdate: any}) {
        const credentialFinding = await this.credentialRepository.findOne({ where: { email: credential.email }});
        if (!credentialFinding) {
            throw new HttpException('Credential not found', HttpStatus.NOT_FOUND);
        }

        Object.assign(credentialFinding, credential.partUpdate);
        
        return this.credentialRepository.save(credentialFinding);
    }

    async findUserByRefreshToken(refreshToken: string): Promise<CredentialEntity | null> {
        return this.credentialRepository.findOne({ where: { refreshToken } });
    }
}