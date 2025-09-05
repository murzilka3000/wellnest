// api/src/auth/auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService, TelegramLoginDto } from './auth.service';

@Controller('auth') // Все роуты здесь будут начинаться с /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK) // При успехе возвращаем статус 200 OK
  @Post('telegram') // Эндпоинт будет доступен по POST /auth/telegram
  login(@Body() dto: TelegramLoginDto) {
    return this.authService.login(dto);
  }
}
