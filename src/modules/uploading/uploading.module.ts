import { Module } from "@nestjs/common";
import { UploadingController } from "./uploading.controller";
import { UploadingService } from "./uploading.service";

@Module({
    controllers: [UploadingController],
    providers: [UploadingService],
})
export class UploadingModule {}