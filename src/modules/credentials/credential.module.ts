import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CredentialEntity } from "./credential.entity";
import { CredentialController } from "./credential.controller";
import { CredentialService } from "./credential.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CredentialEntity
        ]),
    ],
    controllers: [CredentialController],
    providers: [CredentialService],
})

export class CredentialModule {}