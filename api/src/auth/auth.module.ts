// api/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule, // <-- Импортируем модуль пользователей
    JwtModule.register({
      global: true, // <-- Делаем JWT доступным во всем приложении
      secret: 'YOUR_SUPER_SECRET_KEY', // <-- ВАЖНО: потом заменим на переменную окружения
      signOptions: { expiresIn: '7d' }, // Токен будет "жить" 7 дней
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
