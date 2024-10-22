import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumberString, IsOptional, IsString, Min } from "class-validator";
import { OrderEnum } from "./common.enum";
import { HttpStatus } from "@nestjs/common";

export class GottenQueryDto {
    @ApiProperty({ required: false, default: 1 })
    @IsOptional()
    @IsString()
    page?: number = 1

    @ApiProperty({ required: false, default: 20 })
    @IsOptional()
    @IsString()
    limit?: number = 20

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    search?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    sort?: string

    @ApiProperty({ required: false, enum: Object.values(OrderEnum), default: OrderEnum.ASC })
    @IsOptional()
    @IsString()
    order?: OrderEnum.ASC | OrderEnum.DESC;
    
    [key: string]: any; // Allow any additional conditions
}

export class GottenResponseDto<T> {
    data: T[]
    total: number
    page: number
    lastPage: number

    constructor(data: T[], total: number, page: number, lastPage: number) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.lastPage = lastPage;
    }
}

export class SentResponseDto {
    statusCode: HttpStatus
    message: string
    data?: any

    constructor(input: {statusCode: HttpStatus, message: string, payload?: any}) {
        this.statusCode = input.statusCode;
        this.message = input.message;
        this.data = input.payload;
    }
}