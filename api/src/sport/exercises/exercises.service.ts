// api/src/sport/exercises/exercises.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseEntity } from '../exercise.entity';
import { CreateExerciseDto, UpdateExerciseDto } from './exercises.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepository: Repository<ExerciseEntity>,
  ) {}

  // Создать новое упражнение
  async create(
    createExerciseDto: CreateExerciseDto,
    userId: string,
  ): Promise<ExerciseEntity> {
    const newExercise = this.exerciseRepository.create({
      ...createExerciseDto,
      user: { id: userId }, // Связываем упражнение с пользователем
    });
    return this.exerciseRepository.save(newExercise);
  }

  // Получить все упражнения пользователя
  async findAllByUser(userId: string): Promise<ExerciseEntity[]> {
    return this.exerciseRepository.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' }, // Сортируем по имени
    });
  }

  // Получить одно упражнение по ID
  async findOne(exerciseId: string, userId: string): Promise<ExerciseEntity> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id: exerciseId, user: { id: userId } }, // Проверяем и ID, и принадлежность пользователю
    });
    if (!exercise) {
      throw new NotFoundException(
        `Exercise with ID "${exerciseId}" not found or does not belong to user.`,
      );
    }
    return exercise;
  }

  // Обновить упражнение
  async update(
    exerciseId: string,
    updateExerciseDto: UpdateExerciseDto,
    userId: string,
  ): Promise<ExerciseEntity> {
    // Сначала убедимся, что упражнение существует и принадлежит пользователю
    const exercise = await this.findOne(exerciseId, userId);

    // Обновляем поля и сохраняем
    Object.assign(exercise, updateExerciseDto);
    return this.exerciseRepository.save(exercise);
  }

  // Удалить упражнение
  async remove(exerciseId: string, userId: string): Promise<void> {
    const result = await this.exerciseRepository.delete({
      id: exerciseId,
      user: { id: userId }, // Убеждаемся, что удаляем только свое упражнение
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Exercise with ID "${exerciseId}" not found or does not belong to user.`,
      );
    }
  }
}
