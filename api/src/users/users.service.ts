// api/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

// Описываем, какие данные от Telegram мы ожидаем
type TelegramUserData = {
  id: number;
  first_name: string;
  username?: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Главный метод: найти пользователя по telegramId. Если нет - создать.
  async findOrCreate(userData: TelegramUserData): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { telegramId: userData.id },
    });

    if (user) {
      return user; // Если пользователь найден, возвращаем его
    }

    // Если нет - создаем нового
    const newUser = this.userRepository.create({
      telegramId: userData.id,
      firstName: userData.first_name,
      username: userData.username,
    });

    return this.userRepository.save(newUser); // Сохраняем и возвращаем
  }
}
