import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { createNoteEntity, NoteEntity } from '../notes/notes.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToMany(() => createNoteEntity(), (note) => note.user)
  notes: NoteEntity[];
}

export function createUserEntity() {
  return UserEntity;
}
