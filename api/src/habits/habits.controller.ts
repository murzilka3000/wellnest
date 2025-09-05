// api/src/habits/habits.controller.ts
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { HabitsService } from './habits.service';

// DTO для валидации данных при создании привычки
class CreateHabitDto {
  title: string;
}

@UseGuards(AuthGuard) // <-- ЗАЩИЩАЕМ ВЕСЬ КОНТРОЛЛЕР СРАЗУ
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  async findAll(@Req() req) {
    // req.user.userId берется из токена, который проверил AuthGuard
    const userId = req.user.userId;
    return this.habitsService.findAllByUser(userId);
  }

  @Post()
  async create(@Body() createHabitDto: CreateHabitDto, @Req() req) {
    const userId = req.user.userId;
    return this.habitsService.create(createHabitDto.title, userId);
  }
}
