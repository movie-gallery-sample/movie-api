import { FileInterceptor } from "@nestjs/platform-express";
import { HttpCommonException } from "src/exceptions/common.exception";

export const ImageFileInterceptor = FileInterceptor('file', {
    limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB limit
    fileFilter: (req, file, callback) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const extname = fileTypes.test(file.mimetype);
      if (extname) {
        return callback(null, true);
      }
      callback(HttpCommonException({message: 'Invalid file type ! Must be an image !'}), false);
    },
});