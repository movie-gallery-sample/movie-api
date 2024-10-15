import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { IsPasswordMatch } from "src/validators/auth/isPasswordMatch"
import { IsPasswordValid } from "src/validators/auth/isPasswordValid"

export class CredentialDto {
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    @IsPasswordValid()
    password: string

    @IsString()
    @IsNotEmpty()
    @IsPasswordMatch('password')
    confirmPassword: string
}

export class LoginRequest {
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}

export class LoginResponse {
    email: string
    accessToken: string
    refreshToken: string
}