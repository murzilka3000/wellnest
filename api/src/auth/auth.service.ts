// api/src/auth/auth.service.ts
// ... (все импорты и DTO остаются как есть) ...
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as crypto from 'crypto';

export class TelegramLoginDto {
  id: number;
  first_name: string;
  username?: string;
  auth_date: number;
  hash: string;
  photo_url?: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // ... (метод login, parseInitData, validateTelegramHash остаются без изменений) ...
  async login(dto: any) {
    let preparedData: TelegramLoginDto;
    if (dto && dto.initData) {
      preparedData = this.parseInitData(dto.initData);
    } else if (dto && dto.hash) {
      preparedData = dto;
    } else {
      throw new BadRequestException('Invalid login data provided');
    }
    this.validateTelegramHash(preparedData);
    const user = await this.usersService.findOrCreate(preparedData);
    const payload = { sub: user.id, telegramId: user.telegramId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private parseInitData(initData: string): TelegramLoginDto {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    const userParam = params.get('user');
    if (!hash || !userParam) {
      throw new BadRequestException(
        'Invalid initData: hash or user is missing',
      );
    }
    const user = JSON.parse(userParam);
    return {
      hash: hash,
      ...user,
      auth_date: parseInt(params.get('auth_date')),
    };
  }

  private validateTelegramHash(dto: TelegramLoginDto): void {
    const botToken = '8229224953:AAH8Rl6f-NK5MQOMjmQrFszDOHisnaJ-HF0';
    const { hash, ...userData } = dto;
    const dataCheckString = Object.keys(userData)
      .filter((key) => userData[key] !== undefined)
      .sort()
      .map((key) => `${key}=${userData[key]}`)
      .join('\n');
    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    if (hmac !== hash) {
      throw new UnauthorizedException(
        'Invalid Telegram hash. Data is not from Telegram.',
      );
    }
  }

  // --- НАЧАЛО ИЗМЕНЕНИЙ: НОВЫЙ МЕТОД ---
  /**
   * Генерирует токен для тестового пользователя.
   * ID и telegramId должны соответствовать тому, что мы вставили в базу.
   */
  async getDevToken() {
    const testUserPayload = {
      sub: '00000000-0000-0000-0000-000000000001', // UUID тестового пользователя
      telegramId: 123456789, // telegramId тестового пользователя
    };
    return {
      access_token: await this.jwtService.signAsync(testUserPayload),
    };
  }
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---
}
