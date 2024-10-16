import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { IsPasswordMatch } from "src/validators/auth/isPasswordMatch"
import { IsPasswordValid } from "src/validators/auth/isPasswordValid"

export class CredentialDto {
    @ApiProperty({ example: 'example@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'P@ssw0rd' })
    @IsString()
    @IsNotEmpty()
    @IsPasswordValid()
    password: string

    @ApiProperty({ example: 'P@ssw0rd' })
    @IsString()
    @IsNotEmpty()
    @IsPasswordMatch('password')
    confirmPassword: string
}

export class LoginRequest {
    @ApiProperty({ example: 'example@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'P@ssw0rd' })
    @IsString()
    @IsNotEmpty()
    password: string
}

export class LoginResponse {
    email: string
    accessToken: string
    refreshToken: string
}