import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './movie.entity';
import { Repository } from 'typeorm';
import { MovieDto } from './movie.dto';
import { GottenQueryDto, GottenResponseDto } from '../common/common.dto';
import { OrderEnum } from '../common/common.enum';
import { ApiFeature, SearchWithEnum } from '../common/api.feature';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  async getAll(queries: GottenQueryDto): Promise<GottenResponseDto<MovieDto>> {
    const movies = new ApiFeature<MovieEntity>(this.movieRepository);
    
    return movies.generate({
      queries,
      searchWith: [
        { column: 'title', type: SearchWithEnum.STRING },
        { column: 'publishingYear', type: SearchWithEnum.NUMBER },
      ],
    });
  }

  async create(movie: MovieDto): Promise<MovieDto> {
    return this.movieRepository.save(movie);
  }

  async update(body: { id: string; partUpdate: any }): Promise<MovieDto> {
    const movie = await this.movieRepository.findOneBy({ id: body.id });

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
