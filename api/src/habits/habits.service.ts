// api/src/habits/habits.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitEntity } from './habit.entity';
import { HabitLogEntity } from './habit-log.entity';
import { subDays, isSameDay } from 'date-fns';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
}

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(HabitEntity)
    private readonly habitRepository: Repository<HabitEntity>,
    // --- ИСПРАВЛЕНИЕ ОШИБКИ: Правильный тип для habitLogRepository ---
    @InjectRepository(HabitLogEntity)
    private readonly habitLogRepository: Repository<HabitLogEntity>,
    // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
  ) {}

  async findAllByUser(userId: string) {
    const habits = await this.habitRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
    });

    const habitsWithStatus = await Promise.all(
      habits.map(async (habit) => {
        // Получаем ВСЕ логи для этой привычки, отсортированные по дате (от новой к старой)
        const allLogsAsc = await this.habitLogRepository.find({
          where: { habit: { id: habit.id } },
          order: { date: 'ASC' },
        });
        const logsDesc = [...allLogsAsc].reverse(); // Копируем и переворачиваем для `isCompletedToday`

        const today = new Date();
        const isCompletedToday =
          logsDesc.length > 0 && isSameDay(new Date(logsDesc[0].date), today);

        const { currentStreak } = this.calculateStreaks(allLogsAsc, today);

        return {
          ...habit,
          isCompletedToday,
          streak: currentStreak,
        };
      }),
    );
    return habitsWithStatus;
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

  async getStats(habitId: string, userId: string) {
    const habit = await this.habitRepository.findOneBy({
      id: habitId,
      user: { id: userId },
    });
    if (!habit) {
      throw new NotFoundException(
        `Habit with ID "${habitId}" not found for this user.`,
      );
    }

    const logsAsc = await this.habitLogRepository.find({
      where: { habit: { id: habitId } },
      order: { date: 'ASC' },
    });

    const today = new Date();
    const { currentStreak, longestStreak } = this.calculateStreaks(
      logsAsc,
      today,
    );

    const totalCompletions = logsAsc.length;
    const completionHistory = logsAsc.map((log) => log.date);

    return {
      habitTitle: habit.title,
      totalCompletions,
      currentStreak,
      longestStreak,
      completionHistory,
    };
  }

  private calculateStreaks(logs: HabitLogEntity[], today: Date): StreakData {
    if (logs.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const sortedLogDates = logs.map((log) => new Date(log.date));

    let currentStreak = 0;
    let longestStreak = 0;

    // Для удобства работы с датами и поиска
    const logDatesSet = new Set(
      sortedLogDates.map((d) => d.toISOString().split('T')[0]),
    );

    // --- Подсчет текущего стрика (currentStreak) ---
    // Идем назад от сегодня, пока не найдем пропуск
    let tempCheckDate = new Date(today);
    let tempCurrentStreak = 0;

    // Проверяем, есть ли запись за сегодня
    if (logDatesSet.has(tempCheckDate.toISOString().split('T')[0])) {
      tempCurrentStreak = 1;
      tempCheckDate = subDays(tempCheckDate, 1);
      // Идем назад, пока есть логи
      while (logDatesSet.has(tempCheckDate.toISOString().split('T')[0])) {
        tempCurrentStreak++;
        tempCheckDate = subDays(tempCheckDate, 1);
      }
    } else {
      // Если сегодня не выполнено, проверяем вчера
      tempCheckDate = subDays(today, 1);
      if (logDatesSet.has(tempCheckDate.toISOString().split('T')[0])) {
        // Если вчера выполнено, то текущий стрик с сегодня = 0.
        // Для UI можно добавить логику "был стрик до вчерашнего дня".
      }
    }
    currentStreak = tempCurrentStreak;

    // --- Подсчет самого длинного стрика (longestStreak) ---
    // Идем по логам вперед (по возрастанию дат)
    let tempStreak = 0;
    let lastLogDate: Date | null = null;

    // Получаем уникальные и отсортированные даты из логов для Longest Streak
    const uniqueSortedLogDates = [...new Set(logs.map((log) => log.date))]
      .map((dateStr) => new Date(dateStr))
      .sort((a, b) => a.getTime() - b.getTime());

    for (const logDate of uniqueSortedLogDates) {
      if (lastLogDate === null) {
        tempStreak = 1;
      } else if (isSameDay(logDate, subDays(lastLogDate, -1))) {
        // Проверяем, что это следующий день
        tempStreak++;
      } else {
        tempStreak = 1; // Серия прервалась, начинаем новую
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      lastLogDate = logDate;
    }

    // Последний tempStreak может быть самым длинным, если серия еще продолжается
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    return { currentStreak, longestStreak };
  }
}
