import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { NoteEntity } from './notes.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { NoteEntityInfo } from './response/note.entity.response';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
    private readonly usersService: UsersService,
  ) {}

  async findAllNotes(userId: string): Promise<NoteEntityInfo[]> {
    const result: NoteEntityInfo[] = [];
    // Implement logic to retrieve all notes for a user from the database
    const allNotes = await this.noteRepository.find({
      where: { user: { id: userId } },
    });

    allNotes.map((resp) => {
      result.push(new NoteEntityInfo(resp.id, resp.title, resp.content));
    });

    return result;
  }

  async findNoteById(
    noteId: string,
    userId: string,
  ): Promise<NoteEntityInfo | any> {
    // Implement logic to retrieve a note by ID for a user from the database
    const result = await this.noteRepository.findOne({
      where: { id: noteId, user: { id: userId } },
    });

    if (!result) {
      throw new NotFoundException('Note with the this Id.');
    }

    return new NoteEntityInfo(result.id, result.title, result.content);
  }

  async createNote(
    createNoteDto: CreateNoteDto,
    userId: string,
  ): Promise<NoteEntityInfo | any> {
    try {
      // Implement logic to create a new note for a user in the database
      const newNote = this.noteRepository.create({
        ...createNoteDto,
        user: { id: userId },
      });
      const resp = await this.noteRepository.save(newNote);
      return new NoteEntityInfo(resp.id, resp.title, resp.content);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('ER_DUP_ENTRY')
      ) {
        // Handle duplicate entry error
        throw new NotFoundException('Note with the same title already exists.');
      }
      throw error;
    }
  }

  async updateNote(
    noteId: string,
    updateNoteDto: UpdateNoteDto,
    userId: string,
  ): Promise<NoteEntityInfo | any> {
    // Implement logic to update an existing note by ID for a user in the database
    const existingNote = await this.noteRepository.findOne({
      where: {
        id: noteId,
        user: { id: userId },
      },
    });

    if (!existingNote) {
      return null; // Note not found
    }

    const updatedNote = { ...existingNote, ...updateNoteDto };
    await this.noteRepository.save(updatedNote);
    return new NoteEntityInfo(
      updatedNote.id,
      updatedNote.title,
      updatedNote.content,
    );
  }

  async deleteNoteById(noteId: string, userId: string): Promise<boolean> {
    // Implement logic to delete a note by ID for a user from the database
    const existingNote = await this.noteRepository.findOne({
      where: { id: noteId, user: { id: userId } },
    });

    if (!existingNote) {
      return false; // Note not found
    }

    await this.noteRepository.remove(existingNote);
    return true; // Note successfully deleted
  }

  async shareNoteWithUser(
    noteId: string,
    targetUserId: string,
    userId: string,
  ): Promise<NoteEntityInfo | any> {
    // Check if the note exists and belongs to the current user
    const note = await this.noteRepository.findOne({
      where: { id: noteId, user: { id: userId } },
    });

    if (!note) {
      return null; // Note not found or doesn't belong to the current user
    }

    // Check if the target user exists
    const targetUser = await this.usersService.findByUserId(targetUserId);

    if (!targetUser) {
      return null; // Target user not found
    }

    // Update the note's user property with the target user's ID
    note.user = targetUser;

    // Save the updated note
    await this.noteRepository.save(note);

    return new NoteEntityInfo(note.id, note.title, note.content);
  }

  async searchNotes(query: string, userId: string): Promise<NoteEntityInfo[]> {
    const searchResult: NoteEntityInfo[] = [];
    // Implement a basic SQL query to search notes based on the title
    const notes = await this.noteRepository
      .createQueryBuilder('note')
      .where('note.user.id = :userId', { userId })
      .andWhere('note.title LIKE :query', { query: `%${query}%` })
      .getMany();

    notes.map((resp) => {
      searchResult.push(new NoteEntityInfo(resp.id, resp.title, resp.content));
    });

    return searchResult;
  }
}
