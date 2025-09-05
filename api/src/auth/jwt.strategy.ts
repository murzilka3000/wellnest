// api/src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      // Указываем, что токен будет извлекаться из заголовка Authorization как Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Говорим, что не будем игнорировать истекший срок годности токена
      ignoreExpiration: false,
      // Используем тот же секретный ключ, что и при создании токена в auth.module.ts
      secretOrKey:
        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', // ВАЖНО: потом заменим на переменную окружения
    });
  }

  // Этот метод будет вызван Passport'ом, если подпись токена верна
  // и срок его годности не истек.
  async validate(payload: any) {
    // В payload будет лежать то, что мы записывали при создании токена: { sub: user.id, telegramId: user.telegramId }
    // Мы можем здесь, например, найти пользователя в базе, чтобы убедиться, что он не удален.
    // Но пока для простоты просто вернем payload.
    // Все, что вернет этот метод, будет записано в `request.user`.
    return { userId: payload.sub, telegramId: payload.telegramId };
  }
}
