import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CredentialDto {
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    confirmPassword: string
}