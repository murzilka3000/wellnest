// api/src/sport/exercises/exercises.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto, UpdateExerciseDto } from './exercises.dto';

@UseGuards(AuthGuard) // Защищаем все эндпоинты этого контроллера
@Controller('exercises') // Базовый роут будет /exercises
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  async create(@Body() createExerciseDto: CreateExerciseDto, @Req() req) {
    const userId = req.user.userId;
    return this.exercisesService.create(createExerciseDto, userId);
  }

  @Get()
  async findAll(@Req() req) {
    const userId = req.user.userId;
    return this.exercisesService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') exerciseId: string, @Req() req) {
    const userId = req.user.userId;
    return this.exercisesService.findOne(exerciseId, userId);
  }

  @Put(':id')
  async update(
    @Param('id') exerciseId: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.exercisesService.update(exerciseId, updateExerciseDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') exerciseId: string, @Req() req) {
    const userId = req.user.userId;
    return this.exercisesService.remove(exerciseId, userId);
  }
}
