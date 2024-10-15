import { Body, Controller, Get, Post } from "@nestjs/common";
import { CredentialService } from "./credential.service";
import { CredentialDto } from "./credential.dto";

@Controller('credentials')
export class CredentialController {
    constructor(private readonly credentialService: CredentialService) {}

    @Get()
    getBonjour(): string {
        return 'hihi';
    }

    @Post()
    async createCredential(@Body() credential: CredentialDto): Promise<string> {
        if (credential.password !== credential.confirmPassword) {
            return 'Password does not match to confirmed password'
        }

        const message = await this.credentialService.save(credential);
        return message;
    }
}