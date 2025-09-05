// api/src/habits/habits.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitEntity } from './habit.entity';
import { HabitLogEntity } from './habit-log.entity';
import { subDays, isSameDay } from 'date-fns';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(HabitEntity)
    private readonly habitRepository: Repository<HabitEntity>,
    @InjectRepository(HabitLogEntity)
    private readonly habitLogRepository: Repository<HabitLogEntity>,
  ) {}

  async findAllByUser(userId: string) {
    const habits = await this.habitRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
    });

    const habitsWithStatus = await Promise.all(
      habits.map(async (habit) => {
        const logs = await this.habitLogRepository.find({
          where: { habit: { id: habit.id } },
          order: { date: 'DESC' },
        });

        const today = new Date();
        const isCompletedToday =
          logs.length > 0 && isSameDay(new Date(logs[0].date), today);

        // --- ИЗМЕНЕНИЕ: Используем наш новый приватный метод ---
        const streak = this.calculateStreak(logs);

        return {
          ...habit,
          isCompletedToday,
          streak,
        };
      }),
    );
    return habitsWithStatus;
  }

  // ... (методы create, remove, logHabit, unlogHabit остаются без изменений) ...
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

  async logHabit(habitId: string, userId: string): Promise<HabitLogEntity> {
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
    const existingLog = await this.habitLogRepository.findOneBy({
      habit: { id: habitId },
      date: today,
    });
    if (existingLog) {
      return existingLog;
    }
    const newLog = this.habitLogRepository.create({ habit, date: today });
    return this.habitLogRepository.save(newLog);
  }

  async unlogHabit(habitId: string, userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
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

  // --- НАЧАЛО ИЗМЕНЕНИЙ: НОВЫЙ МЕТОД ДЛЯ СТАТИСТИКИ ---
  async getStats(habitId: string, userId: string) {
    // 1. Убеждаемся, что привычка существует и принадлежит пользователю
    const habit = await this.habitRepository.findOneBy({
      id: habitId,
      user: { id: userId },
    });
    if (!habit) {
      throw new NotFoundException(
        `Habit with ID "${habitId}" not found for this user.`,
      );
    }

    // 2. Получаем все логи для этой привычки
    const logs = await this.habitLogRepository.find({
      where: { habit: { id: habitId } },
      order: { date: 'DESC' },
    });

    // 3. Считаем статистику
    const currentStreak = this.calculateStreak(logs);
    const totalCompletions = logs.length;
    // Просто возвращаем массив дат в формате 'YYYY-MM-DD' для отрисовки календаря
    const completionHistory = logs.map((log) => log.date);

    // TODO: В будущем здесь будет логика подсчета самого длинного стрика
    const longestStreak = currentStreak; // Пока для простоты используем текущий

    return {
      habitTitle: habit.title,
      totalCompletions,
      currentStreak,
      longestStreak,
      completionHistory,
    };
  }
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---

  // --- НАЧАЛО ИЗМЕНЕНИЙ: Рефакторинг логики стрика в отдельный метод ---
  private calculateStreak(logs: HabitLogEntity[]): number {
    if (logs.length === 0) {
      return 0;
    }

    const today = new Date();
    const latestLogDate = new Date(logs[0].date);

    // Если последняя запись не сегодня и не вчера, то стрик точно прерван.
    if (
      !isSameDay(latestLogDate, today) &&
      !isSameDay(latestLogDate, subDays(today, 1))
    ) {
      return 0;
    }

    let currentStreak = 1;
    // Проверяем остальные дни
    for (let i = 1; i < logs.length; i++) {
      const currentLogDate = new Date(logs[i - 1].date);
      const previousLogDate = new Date(logs[i].date);
      const expectedPreviousDate = subDays(currentLogDate, 1);

      if (isSameDay(previousLogDate, expectedPreviousDate)) {
        currentStreak++;
      } else {
        // Нашли "дырку" в последовательности, серия прервалась.
        break;
      }
    }

    return currentStreak;
  }
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---
}
