import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { HabitsService } from './habits.service';

class CreateHabitDto {
  title: string;
}

@UseGuards(AuthGuard)
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  async findAll(@Req() req) {
    const userId = req.user.userId;
    return this.habitsService.findAllByUser(userId);
  }

  @Post()
  async create(@Body() createHabitDto: CreateHabitDto, @Req() req) {
    const userId = req.user.userId;
    return this.habitsService.create(createHabitDto.title, userId);
  }

  // --- НАЧАЛО ИЗМЕНЕНИЙ ---
  @Delete(':id') // Эндпоинт будет DELETE /habits/some-uuid
  @HttpCode(HttpStatus.NO_CONTENT) // При успехе возвращаем статус 204 No Content
  async remove(@Param('id') habitId: string, @Req() req) {
    const userId = req.user.userId;
    return this.habitsService.remove(habitId, userId);
  }
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---
}
