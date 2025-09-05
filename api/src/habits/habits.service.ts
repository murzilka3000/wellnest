// api/src/habits/habits.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitEntity } from './habit.entity';
import { HabitLogEntity } from './habit-log.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(HabitEntity)
    private readonly habitRepository: Repository<HabitEntity>,
    // --- НАЧАЛО ИЗМЕНЕНИЙ ---
    @InjectRepository(HabitLogEntity)
    private readonly habitLogRepository: Repository<HabitLogEntity>,
    // --- КОНЕЦ ИЗМЕНЕНИЙ ---
  ) {}

  async findAllByUser(userId: string) {
    // Убрали тип, т.к. будем добавлять поле
    const habits = await this.habitRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
    });

    // --- НАЧАЛО ИЗМЕНЕНИЙ ---
    // Для каждой привычки проверяем, есть ли лог за СЕГОДНЯ
    const today = new Date().toISOString().split('T')[0]; // Формат 'YYYY-MM-DD'
    const habitsWithStatus = await Promise.all(
      habits.map(async (habit) => {
        const log = await this.habitLogRepository.findOne({
          where: {
            habit: { id: habit.id },
            date: today,
          },
        });
        return { ...habit, isCompletedToday: !!log }; // Добавляем поле isCompletedToday
      }),
    );
    return habitsWithStatus;
    // --- КОНЕЦ ИЗМЕНЕНИЙ ---
  }

  async create(title: string, userId: string): Promise<HabitEntity> {
    const newHabit = this.habitRepository.create({
      title,
      user: { id: userId },
    });
    return this.habitRepository.save(newHabit);
  }

  async remove(habitId: string, userId: string): Promise<void> {
    const result = await this.habitRepository.delete({
      id: habitId,
      user: { id: userId },
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Habit with ID "${habitId}" not found`);
    }
  }

  // --- НАЧАЛО ИЗМЕНЕНИЙ: НОВЫЕ МЕТОДЫ ---
  /**
   * Создает лог о выполнении привычки на сегодня.
   */
  async logHabit(habitId: string, userId: string): Promise<HabitLogEntity> {
    // Проверяем, существует ли такая привычка и принадлежит ли она пользователю
    const habit = await this.habitRepository.findOneBy({
      id: habitId,
      user: { id: userId },
    });
    if (!habit) {
      throw new NotFoundException(
        `Habit with ID "${habitId}" not found for this user.`,
      );
    }

    const today = new Date().toISOString().split('T')[0];

    // Проверяем, не создан ли уже лог на сегодня, чтобы избежать дублей
    const existingLog = await this.habitLogRepository.findOneBy({
      habit: { id: habitId },
      date: today,
    });
    if (existingLog) {
      return existingLog; // Если уже есть, просто возвращаем его
    }

    const newLog = this.habitLogRepository.create({ habit, date: today });
    return this.habitLogRepository.save(newLog);
  }

  /**
   * Удаляет лог о выполнении привычки за сегодня.
   */
  async unlogHabit(habitId: string, userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    // Мы не можем просто удалить лог по ID, т.к. мы его не знаем.
    // Вместо этого мы находим привычку, убеждаемся, что она принадлежит пользователю,
    // а затем удаляем лог, связанный с ней и сегодняшней датой.
    const habit = await this.habitRepository.findOneBy({
      id: habitId,
      user: { id: userId },
    });
    if (!habit) {
      throw new NotFoundException(
        `Habit with ID "${habitId}" not found for this user.`,
      );
    }

    await this.habitLogRepository.delete({
      habit: { id: habitId },
      date: today,
    });
  }
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---
}
