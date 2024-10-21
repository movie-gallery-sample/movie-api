import { Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UploadingService } from "./uploading.service";
import { ImageFileInterceptor } from "./uploading.utils";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileUploadingDto } from "./uploading.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags('uploading')
@Controller('uploading')
export class UploadingController {
    constructor(private readonly uploadingService: UploadingService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(ImageFileInterceptor)
    @ApiOperation({ summary: 'Upload a file' })
    @ApiResponse({ status: 201, description: 'File uploaded successfully' })
    @ApiResponse({ status: 400 })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: FileUploadingDto,
    })
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadingService.handleFileUploading(file);
    }
}