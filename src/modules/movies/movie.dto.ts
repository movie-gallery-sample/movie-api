import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MovieDto {
    @Expose()
    id: string
    
    @ApiProperty({ example: 'The silence of the lambs' })
    @Expose()
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({ example: 1997 })
    @Expose()
    @IsInt()
    @IsNotEmpty()
    publishingYear: number

    @ApiProperty({ example: 'url...' })
    @Expose()
    @IsString()
    @IsNotEmpty()
    posterUrl: string
}

export class UpdateMovieDto {
    @ApiProperty({ example: 'The silence of the lambs' })
    @IsOptional()
    @IsString()
    title?: string

    @ApiProperty({ example: 1997 })
    @IsOptional()
    @IsInt()
    publishingYear?: string

    @ApiProperty({ example: 'url...' })
    @IsOptional()
    @IsString()
    posterUrl?: string
}