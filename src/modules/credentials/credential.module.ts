import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CredentialEntity } from "./credential.entity";
import { CredentialController } from "./credential.controller";
import { CredentialService } from "./credential.service";
import { JwtStrategy } from "src/strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CredentialEntity
        ]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
        }),
    ],
    controllers: [CredentialController],
    providers: [CredentialService, JwtStrategy],
})

export class CredentialModule {}