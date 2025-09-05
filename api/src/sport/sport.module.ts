// api/src/sport/sport.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseEntity } from './exercise.entity';
import { ExercisesService } from './exercises/exercises.service';
import { ExercisesController } from './exercises/exercises.controller';
import { AuthModule } from 'src/auth/auth.module'; // <-- Импортируем AuthModule для AuthGuard

@Module({
  imports: [
    TypeOrmModule.forFeature([ExerciseEntity]), // Регистрируем сущность в этом модуле
    AuthModule, // Чтобы использовать AuthGuard
  ],
  providers: [ExercisesService],
  controllers: [ExercisesController],
  exports: [ExercisesService], // Возможно, понадобится экспортировать, если другие модули будут использовать ExerciseService
})
export class SportModule {}
