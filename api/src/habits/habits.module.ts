// api/src/habits/habits.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitEntity } from './habit.entity';
import { HabitLogEntity } from './habit-log.entity';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HabitEntity, HabitLogEntity])],
  providers: [HabitsService],
  controllers: [HabitsController],
})
export class HabitsModule {}
