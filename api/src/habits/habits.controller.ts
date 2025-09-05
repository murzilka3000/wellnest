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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') habitId: string, @Req() req) {
    const userId = req.user.userId;
    return this.habitsService.remove(habitId, userId);
  }

  // --- НАЧАЛО ИЗМЕНЕНИЙ: НОВЫЕ ЭНДПОИНТЫ ---
  @Post(':id/log') // POST /habits/some-uuid/log
  async logHabit(@Param('id') habitId: string, @Req() req) {
    const userId = req.user.userId;
    return this.habitsService.logHabit(habitId, userId);
  }

  @Delete(':id/log') // DELETE /habits/some-uuid/log
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlogHabit(@Param('id') habitId: string, @Req() req) {
    const userId = req.user.userId;
    return this.habitsService.unlogHabit(habitId, userId);
  }
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---
}
