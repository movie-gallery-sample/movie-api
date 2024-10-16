import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MovieDto {
    @Expose()
    id: string
    
    @Expose()
    @IsString()
    @IsNotEmpty()
    title: string

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    publishingYear: number

    @Expose()
    @IsString()
    @IsNotEmpty()
    posterUrl: string
}