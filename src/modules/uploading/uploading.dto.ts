import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UploadingDto {
    @Expose()
    filename: string

    @Expose()
    path: string

    @Expose()
    message: string = 'File uploaded successfully !'

    constructor(input: {filename: string, path: string, message?: string}) {
        const { filename, path, message } = input;
        this.filename = filename;
        this.path = path;

        if (message) {
            this.message = message;
        }
    }
}

export class FileUploadingDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any
}