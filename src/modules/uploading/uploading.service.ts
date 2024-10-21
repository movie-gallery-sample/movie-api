import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { promises as fs } from 'fs';
import { join } from 'path';
import { UploadingDto } from "./uploading.dto";
import { HttpCommonException } from "src/exceptions/common.exception";

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
}