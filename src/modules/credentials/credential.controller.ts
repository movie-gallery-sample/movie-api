import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";
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
        const message = await this.credentialService.save(credential);
        throw new HttpException(message, HttpStatus.CREATED);
    }
}