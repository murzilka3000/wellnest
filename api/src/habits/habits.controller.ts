// api/src/habits/habits.controller.ts
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

@UseGuards(AuthGuard) // Защищаем все эндпоинты в этом контроллере
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  async findAll(@Req() req) {
    const userId = req.user.userId;
    return this.habitsService.findAllByUser(userId);
  }

  // --- НАЧАЛО ИЗМЕНЕНИЙ: НОВЫЙ ЭНДПОИНТ ДЛЯ СТАТИСТИКИ ---
  // Важно: этот роут должен быть ДО роута @Delete(':id'),
  // чтобы Nest не перепутал 'stats' с ':id'.
  @Get(':id/stats')
  async getStats(@Param('id') habitId: string, @Req() req) {
    const userId = req.user.userId;
    return this.habitsService.getStats(habitId, userId);
  }
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---

  @Post()
  async create(@Body() createHabitDto: CreateHabitDto, @Req() req) {
    const userId = req.user.userId;
    return this.habitsService.create(createHabitDto.title, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') habitId: string, @Req() req) {
    const userId = req.user.userId;
    return this.habitsService.remove(habitId, userId);
  }

  @Post(':id/log')
  async logHabit(@Param('id') habitId: string, @Req() req) {
    const userId = req.user.userId;
    return this.habitsService.logHabit(habitId, userId);
  }

  @Delete(':id/log')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlogHabit(@Param('id') habitId: string, @Req() req) {
    const userId = req.user.userId;
    return this.habitsService.unlogHabit(habitId, userId);
  }
}
