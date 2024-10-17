import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumberString, IsOptional, IsString, Min } from "class-validator";
import { OrderEnum } from "./common.enum";

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

    @IsOptional()
    others?: any
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