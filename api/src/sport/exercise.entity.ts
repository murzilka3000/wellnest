// api/src/sport/exercise.entity.ts
import { UserEntity } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'exercises' })
export class ExerciseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  // Массив строк для групп мышц
  @Column('text', { array: true, default: '{}' })
  muscleGroups: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Связь с пользователем, который создал это упражнение
  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;
}
