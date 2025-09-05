// api/src/auth/auth.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('telegram')
  login(@Body() dto: any) {
    return this.authService.login(dto);
  }

  // --- НАЧАЛО ИЗМЕНЕНИЙ: НОВЫЙ ЭНДПОИНТ ---
  /**
   * ЭТОТ ЭНДПОИНТ СУЩЕСТВУЕТ ТОЛЬКО ДЛЯ РАЗРАБОТКИ!
   * Он выдает валидный токен для заранее созданного тестового пользователя.
   * В продакшене его нужно будет удалить или защитить.
   */
  @Get('dev-login')
  devLogin() {
    // Проверяем, что сервер запущен не в "продакшен" режиме
    if (process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException(
        'This endpoint is not available in production.',
      );
    }
    // Вызываем специальный метод в сервисе для генерации тестового токена
    return this.authService.getDevToken();
  }
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---
}
