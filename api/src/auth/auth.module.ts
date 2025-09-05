// api/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // <-- 1. Импортируем PassportModule
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy'; // <-- 2. Импортируем нашу стратегию

@Module({
  imports: [
    UsersModule,
    PassportModule, // <-- 3. Регистрируем PassportModule
    JwtModule.register({
      global: true,
      secret:
        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  // --- 4. Регистрируем AuthService и JwtStrategy как провайдеры ---
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
