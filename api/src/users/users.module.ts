// api/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // Регистрируем сущность в этом модуле
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController], // <-- ЭКСПОРТИРУЕМ сервис, чтобы AuthModule мог его использовать
})
export class UsersModule {}
