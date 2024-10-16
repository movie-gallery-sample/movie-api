import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { JwtAuthGuard } from "../credentials/jwt-auth.guard";
import { MovieDto } from "./movie.dto";

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MovieController {
    constructor(
        private readonly movieService: MovieService
    ) {}

    @Get()
    async getAllMovies(): Promise<MovieDto[]> {
        return this.movieService.getAll();
    }

    @Post()
    async createMovie(@Body() movie: MovieDto): Promise<MovieDto> {
        return this.movieService.create(movie);
    }

    @Patch(':id')
    async updateMovie(@Param('id') id: string, @Body() body: any): Promise<MovieDto> {
        return this.movieService.update({ id, partUpdate: body });
    }
}