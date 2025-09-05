// api/src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { HabitsModule } from './habits/habits.module';
import { HabitEntity } from './habits/habit.entity';
import { HabitLogEntity } from './habits/habit-log.entity';
import { SportModule } from './sport/sport.module';
import { ExerciseEntity } from './sport/exercise.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Murzilka300!', // Твой пароль
      database: 'habittracker_db',
      entities: [UserEntity, HabitEntity, HabitLogEntity, ExerciseEntity],

      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    HabitsModule,
    SportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
