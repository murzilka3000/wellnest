// api/src/users/users.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  // Мы не добавляем конструктор с UsersService,
  // так как пока он нам не нужен для этого простого эндпоинта.

  @UseGuards(AuthGuard) // <-- 1. СТАВИМ НАШЕГО "СТРАЖА" НА ВХОД
  @Get('me') // <-- 2. Эндпоинт будет доступен по GET /users/me
  getProfile(@Req() req) {
    // 3. После того как AuthGuard успешно проверил токен,
    // он записал данные из токена в объект `req.user`.
    // Мы просто возвращаем эти данные.
    return req.user;
  }
}
