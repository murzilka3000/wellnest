// api/src/habits/habits.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitEntity } from './habit.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(HabitEntity)
    private readonly habitRepository: Repository<HabitEntity>,
  ) {}

  async findAllByUser(userId: string): Promise<HabitEntity[]> {
    return this.habitRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
    });
  }

  async create(title: string, userId: string): Promise<HabitEntity> {
    const newHabit = this.habitRepository.create({
      title,
      user: { id: userId },
    });
    return this.habitRepository.save(newHabit);
  }

  // --- НАЧАЛО ИЗМЕНЕНИЙ ---
  /**
   * Удаляет привычку.
   * Важно: проверяем, что привычка принадлежит именно этому пользователю.
   */
  async remove(habitId: string, userId: string): Promise<void> {
    const result = await this.habitRepository.delete({
      id: habitId,
      user: { id: userId }, // <-- Ключевое условие безопасности!
    });

    // Если ничего не было удалено, значит, привычка не найдена или не принадлежит пользователю
    if (result.affected === 0) {
      throw new NotFoundException(`Habit with ID "${habitId}" not found`);
    }
  }
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---
}
