// api/src/auth/auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

// Мы просто создаем класс, который наследует всю магию от встроенного AuthGuard'а
// 'jwt' - это имя стратегии по умолчанию, которую мы используем
@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {}
