import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MovieEntity } from "./movie.entity";
import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";
import { UploadingService } from "../uploading/uploading.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MovieEntity
        ]),
    ],
    controllers: [MovieController],
    providers: [MovieService, UploadingService],
})

export class MovieModule {}