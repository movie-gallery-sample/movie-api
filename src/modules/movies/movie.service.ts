import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MovieEntity } from "./movie.entity";
import { Repository } from "typeorm";
import { MovieDto } from "./movie.dto";

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(MovieEntity)
        private readonly movieRepository: Repository<MovieEntity>
    ) {}

    async getAll(): Promise<MovieDto[]> {
        return this.movieRepository.find();
    }

    async create(movie: MovieDto): Promise<MovieDto> {
        return this.movieRepository.save(movie);
    }

    async update(body: { id: string, partUpdate: any }): Promise<MovieDto> {
        const movie = await this.movieRepository.findOneBy({id: body.id});

        if (!movie) {
            throw new HttpException('Movie not found !', HttpStatus.NOT_FOUND);
        }

        if (body.partUpdate?.id) {
            delete body.partUpdate.id;
        }

        Object.assign(movie, body.partUpdate);

        return this.movieRepository.save(movie);
    }
}