import { Body, Controller, Delete, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UploadingService } from "./uploading.service";
import { ImageFileInterceptor } from "./uploading.utils";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileRemovingDto, FileUploadingDto } from "./uploading.dto";
import { SentResponseDto } from "../common/common.dto";

@ApiTags('uploading')
@Controller('uploading')
export class UploadingController {
    constructor(private readonly uploadingService: UploadingService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(ImageFileInterceptor)
    @ApiOperation({ summary: 'Upload a file' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'File uploaded successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: FileUploadingDto })
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadingService.handleFileUploading(file);
    }

    @Post('removed-single-file')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK })
    @ApiResponse({ status: HttpStatus.NOT_FOUND })
    @ApiBody({ type: FileRemovingDto })
    async removeFile(@Body() file: FileRemovingDto): Promise<SentResponseDto> {
        return this.uploadingService.removeFileUploading(file.file);
    }
}