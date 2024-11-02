import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { promises as fs } from 'fs';
import { join } from 'path';
import { UploadingDto } from "./uploading.dto";
import { HttpCommonException } from "src/exceptions/common.exception";
import { SentResponseDto } from "../common/common.dto";

@Injectable()
export class UploadingService {
    async handleFileUploading(file: Express.Multer.File) {
        try {
            const publicDir = join(__dirname, '..', '..', '..', '..', 'uploads');
            await fs.mkdir(publicDir, { recursive: true });

            const uploadPath = join(__dirname, '..', '..', '..', '..', 'uploads', `${new Date().getTime()}-${file.originalname}`);
            await fs.writeFile(uploadPath, file.buffer);

            return new UploadingDto({ filename: file.originalname, path: uploadPath });
        } catch (err) {
            throw HttpCommonException(err.message);
        }
    }

    async removeFileUploading(file: string): Promise<SentResponseDto> {
        try {
            const filePath = join(file);
            
            // Check if the file exists before trying to delete it
            try {
                await fs.access(filePath);
            } catch {
                throw HttpCommonException({ message: 'File not found !', httpStatus: HttpStatus.NOT_FOUND });
            }
            
            // Remove the file
            await fs.unlink(filePath);
            return new SentResponseDto({
                message: "File is removed successfully !",
                statusCode: HttpStatus.OK,
            });

        } catch (err) {
            throw HttpCommonException(err.message);
        }
    }
}