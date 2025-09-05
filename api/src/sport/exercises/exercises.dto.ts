// api/src/sport/exercises/exercises.dto.ts
import { IsArray, IsOptional, IsString, IsNotEmpty } from 'class-validator';

// DTO для создания нового упражнения
export class CreateExerciseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Каждый элемент массива должен быть строкой
  muscleGroups?: string[];
}

// DTO для обновления упражнения (все поля необязательны)
export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  muscleGroups?: string[];
}
