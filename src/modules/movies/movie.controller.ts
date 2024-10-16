import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { JwtAuthGuard } from "../credentials/jwt-auth.guard";
import { MovieDto } from "./movie.dto";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('movies')
@Controller('movies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MovieController {
    constructor(
        private readonly movieService: MovieService
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK })
    async getAllMovies(): Promise<MovieDto[]> {
        return this.movieService.getAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({ status: HttpStatus.CREATED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND })
    async createMovie(@Body() movie: MovieDto): Promise<MovieDto> {
        return this.movieService.create(movie);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({ status: HttpStatus.NOT_FOUND })
    async updateMovie(@Param('id') id: string, @Body() body: any): Promise<MovieDto> {
        return this.movieService.update({ id, partUpdate: body });
    }
}