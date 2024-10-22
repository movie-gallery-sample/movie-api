import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { JwtAuthGuard } from "../credentials/jwt-auth.guard";
import { MovieDto, UpdateMovieDto } from "./movie.dto";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GottenResponseDto, GottenQueryDto, SentResponseDto } from "../common/common.dto";

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
    async getAllMovies(@Query() queries: GottenQueryDto): Promise<GottenResponseDto<MovieDto>> {
        return this.movieService.getAll(queries);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: MovieDto })
    @ApiResponse({ status: HttpStatus.CREATED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND })
    async createMovie(@Body() movie: MovieDto): Promise<MovieDto> {
        return this.movieService.create(movie);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: UpdateMovieDto })
    @ApiResponse({ status: HttpStatus.CREATED })
    @ApiResponse({ status: HttpStatus.NOT_FOUND })
    async updateMovie(@Param('id') id: string, @Body() body: UpdateMovieDto): Promise<MovieDto> {
        return this.movieService.update({ id, partUpdate: body });
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK })
    @ApiResponse({ status: HttpStatus.NOT_FOUND })
    async deleteMovie(@Param('id', new ParseUUIDPipe()) id: string): Promise<SentResponseDto> {
        return this.movieService.delete(id);
    }
}