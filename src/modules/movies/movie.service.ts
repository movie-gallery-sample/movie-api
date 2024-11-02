import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './movie.entity';
import { Repository } from 'typeorm';
import { MovieDto } from './movie.dto';
import { GottenQueryDto, GottenResponseDto, SentResponseDto } from '../common/common.dto';
import { OrderEnum } from '../common/common.enum';
import { ApiFeature, SearchWithEnum } from '../common/api.feature';
import { UploadingService } from '../uploading/uploading.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    private readonly uploadingService: UploadingService,
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

  async getOne(id: string): Promise<MovieDto> {
    const movie = await this.movieRepository.findOneBy({ id });

    if (!movie) {
      throw new HttpException('Not found movie !', HttpStatus.NOT_FOUND);
    }

    return movie;
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

    const originalPosterUrl = movie.posterUrl;

    Object.assign(movie, body.partUpdate);

    const response = await this.movieRepository.save(movie);

    if (body.partUpdate?.posterUrl && body.partUpdate.posterUrl !== originalPosterUrl) {
      await this.uploadingService.removeFileUploading(originalPosterUrl);
    }

    return response;
  }

  async delete(id: string): Promise<SentResponseDto> {
    const movie = await this.movieRepository.findOneBy({ id: id });
    if (!movie)  {
      throw new HttpException('Not found movie', HttpStatus.NOT_FOUND);
    }

    await this.movieRepository.delete(id);
    await this.uploadingService.removeFileUploading(movie.posterUrl);
    return new SentResponseDto({ statusCode: HttpStatus.OK, message: 'Delete movie successfully'});
  }
}
