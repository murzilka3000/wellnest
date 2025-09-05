import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitEntity } from './habit.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(HabitEntity)
    private readonly habitRepository: Repository<HabitEntity>,
  ) {}

  // Метод для получения всех привычек конкретного пользователя
  async findAllByUser(userId: string): Promise<HabitEntity[]> {
    return this.habitRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' }, // Сортируем по дате создания
    });
  }

  // Метод для создания новой привычки для конкретного пользователя
  async create(title: string, userId: string): Promise<HabitEntity> {
    const newHabit = this.habitRepository.create({
      title,
      user: { id: userId }, // Связываем привычку с пользователем
    });
    return this.habitRepository.save(newHabit);
  }
}
