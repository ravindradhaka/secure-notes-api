import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { NoteEntityInfo } from './response/note.entity.response';
import { NotFoundException, HttpStatus } from '@nestjs/common';

// Mock the NotesService
jest.mock('./notes.service');

describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [NotesService],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);
  });

  describe('getAllNotes', () => {
    it('should return an array of notes', async () => {
      const userId = 'testUserId';
      const expectedResult: NoteEntityInfo[] = [
        {
          id: 'd626d974-02a4-4ec3-9bb3-cd8f1fff4443',
          title: 'Test Note',
          content: 'Lorem Ipsum',
        },
      ];
      jest.spyOn(service, 'findAllNotes').mockResolvedValueOnce(expectedResult);

      const result = await controller.getAllNotes({ user: userId });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('searchNotes', () => {
    it('should return an array of notes based on search text', async () => {
      const userId = 'testUserId';
      const searchText = 'test';
      const expectedResult: NoteEntityInfo[] = [
        {
          id: 'd626d974-02a4-4ec3-9bb3-cd8f1fff4443',
          title: 'Test Note',
          content: 'Lorem Ipsum',
        },
      ];
      jest.spyOn(service, 'searchNotes').mockResolvedValueOnce(expectedResult);

      const result = await controller.searchNotes({ user: userId }, searchText);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getNoteById', () => {
    it('should return a note by ID', async () => {
      const userId = 'testUserId';
      const noteId = 'testNoteId';
      const expectedResult: NoteEntityInfo = {
        id: 'testNoteId',
        title: 'Test Note',
        content: 'Lorem Ipsum',
      };
      jest.spyOn(service, 'findNoteById').mockResolvedValueOnce(expectedResult);

      const result = await controller.getNoteById(noteId, { user: userId });
      expect(result).toEqual(expectedResult);
    });

    it('should handle a case where the note is not found', async () => {
      const userId = 'testUserId';
      const noteId = 'nonExistentNoteId';
      jest.spyOn(service, 'findNoteById').mockResolvedValueOnce(null);

      await expect(
        controller.getNoteById(noteId, { user: userId }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const userId = 'testUserId';
      const createNoteDto: CreateNoteDto = {
        title: 'New Note',
        content: 'Lorem Ipsum',
      };
      const expectedResult: NoteEntityInfo = {
        id: 'newNoteId',
        title: 'New Note',
        content: 'Lorem Ipsum',
      };
      jest.spyOn(service, 'createNote').mockResolvedValueOnce(expectedResult);

      const result = await controller.createNote(createNoteDto, {
        user: userId,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateNote', () => {
    it('should update an existing note by ID', async () => {
      const userId = 'testUserId';
      const noteId = 'testNoteId';
      const updateNoteDto: UpdateNoteDto = {
        title: 'Updated Note',
        content: 'Updated Content',
      };
      const expectedResult: NoteEntityInfo = {
        id: 'testNoteId',
        title: 'Updated Note',
        content: 'Updated Content',
      };
      jest.spyOn(service, 'updateNote').mockResolvedValueOnce(expectedResult);

      const result = await controller.updateNote(noteId, updateNoteDto, {
        user: userId,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle a case where the note to update is not found', async () => {
      const userId = 'testUserId';
      const nonExistentNoteId = 'nonExistentNoteId';
      const updateNoteDto: UpdateNoteDto = {
        title: 'Updated Note',
        content: 'Updated Content',
      };
      jest.spyOn(service, 'updateNote').mockResolvedValueOnce(null);

      await expect(
        controller.updateNote(nonExistentNoteId, updateNoteDto, {
          user: userId,
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('deleteNote', () => {
    it('should delete a note by ID', async () => {
      const userId = 'testUserId';
      const noteId = 'testNoteId';
      const expectedResult = true;
      jest
        .spyOn(service, 'deleteNoteById')
        .mockResolvedValueOnce(expectedResult);

      const result = await controller.deleteNote(noteId, { user: userId });
      expect(result).toEqual({ message: 'Note deleted successfully' });
    });

    it('should handle a case where the note to delete is not found', async () => {
      const userId = 'testUserId';
      const nonExistentNoteId = 'nonExistentNoteId';
      jest.spyOn(service, 'deleteNoteById').mockResolvedValueOnce(null);

      const result = await controller.deleteNote(nonExistentNoteId, {
        user: userId,
      });
      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Note not found',
        data: null,
      });
    });
  });

  describe('shareNoteWithUser', () => {
    it('should share a note with another user', async () => {
      const userId = 'testUserId';
      const noteId = 'testNoteId';
      const targetUserId = 'targetUserId';
      const expectedResult: NoteEntityInfo = {
        id: 'testNoteId',
        title: 'Shared Note',
        content: 'Shared Content',
      };

      jest
        .spyOn(service, 'shareNoteWithUser')
        .mockResolvedValueOnce(expectedResult);

      const result = await controller.shareNoteWithUser(
        noteId,
        { userId: targetUserId },
        { user: userId },
      );
      expect(result).toEqual({ message: 'Note shared successfully' });
    });

    it('should handle a case where the note to share is not found', async () => {
      const userId = 'testUserId';
      const nonExistentNoteId = 'nonExistentNoteId';
      const targetUserId = 'targetUserId';
      jest.spyOn(service, 'shareNoteWithUser').mockResolvedValueOnce(null);

      await expect(
        controller.shareNoteWithUser(
          nonExistentNoteId,
          { userId: targetUserId },
          { user: userId },
        ),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  afterAll(async () => {
    // Cleanup resources, if needed
  });
});
