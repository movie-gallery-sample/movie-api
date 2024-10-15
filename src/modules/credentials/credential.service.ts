import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CredentialEntity } from "./credential.entity";
import { Repository } from "typeorm";
import { CredentialDto } from "./credential.dto";

@Injectable()
export class CredentialService {
    constructor(
        @InjectRepository(CredentialEntity) private readonly credentialRepository: Repository<CredentialEntity>
    ) {}

    async emailExists(email: string): Promise<boolean> {
        const countEmails = await this.credentialRepository.count({ where: { email } });
        return countEmails > 0;
    }

    async save(credential: CredentialDto): Promise<string> {
        try {
            const isExistedEmail = await this.emailExists(credential.email);
            
            if (isExistedEmail) {
                throw new Error('Email already exists');
            }
            await this.credentialRepository.save(credential);
            return "Created a new account successfully !";
        } catch (error) {
            return error.message || "Something went wrong";
        }
    }
}