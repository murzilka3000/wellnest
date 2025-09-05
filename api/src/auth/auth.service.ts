// api/src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as crypto from 'crypto';

// Этот DTO описывает формат данных, который мы используем ВНУТРИ нашего сервиса.
// Это "чистые" данные после парсинга.
export class TelegramLoginDto {
  id: number;
  first_name: string;
  username?: string;
  auth_date: number;
  hash: string;
  photo_url?: string; // Добавим это поле, т.к. оно может приходить
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Главный метод аутентификации.
   * Принимает данные в любом формате (от виджета или от Mini App),
   * определяет тип, парсит, валидирует и возвращает JWT.
   */
  async login(dto: any) {
    let preparedData: TelegramLoginDto;

    // ШАГ 1: Определяем тип данных и приводим их к единому формату (preparedData)
    if (dto && dto.initData) {
      // Это данные от Mini App
      preparedData = this.parseInitData(dto.initData);
    } else if (dto && dto.hash) {
      // Это данные от старого виджета-кнопки
      preparedData = dto;
    } else {
      // Если пришло что-то непонятное, выбрасываем ошибку
      throw new BadRequestException('Invalid login data provided');
    }

    // ШАГ 2: Проверяем подлинность данных, сравнивая хэши
    this.validateTelegramHash(preparedData);

    // ШАГ 3: Находим или создаем пользователя в нашей базе данных
    const user = await this.usersService.findOrCreate(preparedData);

    // ШАГ 4: Создаем "полезную нагрузку" (payload) для JWT-токена
    const payload = { sub: user.id, telegramId: user.telegramId };

    // ШАГ 5: Генерируем и возвращаем токен
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * Парсит строку initData от Mini App и превращает ее в удобный объект.
   */
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
      ...user, // Копируем все поля из объекта user (id, first_name и т.д.)
      auth_date: parseInt(params.get('auth_date')),
    };
  }

  /**
   * Валидирует хэш, полученный от Telegram.
   */
  private validateTelegramHash(dto: TelegramLoginDto): void {
    const botToken = '8229224953:AAH8Rl6f-NK5MQOMjmQrFszDOHisnaJ-HF0';
    const { hash, ...userData } = dto;

    // Собираем все поля, кроме hash, в одну строку в формате "ключ=значение",
    // отсортированную по алфавиту. Это требование Telegram.
    const dataCheckString = Object.keys(userData)
      .filter((key) => userData[key] !== undefined) // Убираем поля, которые не пришли
      .sort()
      .map((key) => `${key}=${userData[key]}`)
      .join('\n');

    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Сравниваем наш вычисленный хэш с тем, что прислал Telegram.
    // Если они не совпадают, значит, данные подделаны.
    if (hmac !== hash) {
      throw new UnauthorizedException(
        'Invalid Telegram hash. Data is not from Telegram.',
      );
    }
  }
}
