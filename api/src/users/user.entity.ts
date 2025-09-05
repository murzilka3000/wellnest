// api/src/users/user.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' }) // Называем нашу таблицу 'users'
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') // Уникальный ID в формате UUID
  id: string;

  @Column({ type: 'bigint', unique: true }) // ID из Telegram, он большой и уникальный
  telegramId: number;

  @Column({ nullable: true }) // Имя пользователя, может отсутствовать
  username: string;

  @Column({ name: 'first_name' }) // Имя, которое пользователь указал в Telegram
  firstName: string;

  @CreateDateColumn({ name: 'created_at' }) // Дата создания, заполнится автоматически
  createdAt: Date;
}
