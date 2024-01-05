import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  createConnection,
} from 'typeorm';
import { UserEntity, createUserEntity } from '../users/users.entity';

@Entity({ name: 'notes' })
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ name: 'userId' })
  userId: string;

  @ManyToOne(() => createUserEntity(), (user) => user.notes)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}

export function createNoteEntity() {
  return NoteEntity;
}
