// api/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as crypto from 'crypto';

// Описываем, какие данные придут от Telegram Mini App
// hash - это строка для проверки подлинности
export class TelegramLoginDto {
  id: number;
  first_name: string;
  username?: string;
  auth_date: number;
  hash: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Главный метод аутентификации
  async login(dto: TelegramLoginDto) {
    // 1. Проверяем подлинность данных от Telegram
    this.validateTelegramHash(dto);

    // 2. Находим или создаем пользователя в нашей базе данных
    const user = await this.usersService.findOrCreate(dto);

    // 3. Создаем "полезную нагрузку" для токена
    const payload = { sub: user.id, telegramId: user.telegramId };

    // 4. Генерируем и возвращаем токен
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // Метод для валидации хэша от Telegram
  private validateTelegramHash(dto: TelegramLoginDto): void {
    // Получаем токен нашего бота. ВАЖНО: его нужно будет вынести в .env!
    const botToken = '8229224953:AAH8Rl6f-NK5MQOMjmQrFszDOHisnaJ-HF0'; // <-- ЗАМЕНИ НА СВОЙ ТОКЕН

    const { hash, ...userData } = dto;

    const dataCheckString = Object.keys(userData)
      .sort()
      .map((key) => `${key}=${userData[key]}`)
      .join('\n');

    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (hmac !== hash) {
      throw new UnauthorizedException('Invalid Telegram hash');
    }
  }
}
