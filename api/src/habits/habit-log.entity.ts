// api/src/habits/habit-log.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HabitEntity } from './habit.entity';

@Entity({ name: 'habit_logs' })
export class HabitLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Указываем, что лог принадлежит конкретной привычке
  @ManyToOne(() => HabitEntity, { onDelete: 'CASCADE' })
  habit: HabitEntity;

  // Храним дату в формате 'YYYY-MM-DD'
  @Column({ type: 'date' })
  date: string;
}
