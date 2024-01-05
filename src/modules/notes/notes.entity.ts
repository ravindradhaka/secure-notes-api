// src/notes/note.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../users/users.entity';

@Entity('notes')
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ name: 'userId' }) // Ensure the name matches the actual column name in the database
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.notes)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
