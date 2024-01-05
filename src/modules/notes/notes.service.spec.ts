import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { NotFoundException } from '@nestjs/common';
import { NoteEntityInfo } from './response/note.entity.response';
import { NoteEntity } from './notes.entity';
import { UserEntity } from '../users/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Mock the Repository and UsersService
jest.mock('typeorm');
jest.mock('../users/users.service');

describe('NotesService', () => {
  let service: NotesService;
  let noteRepository: Repository<NoteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(NoteEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            queryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    noteRepository = module.get<Repository<NoteEntity>>(
      getRepositoryToken(NoteEntity),
    );
  });

  describe('findAllNotes', () => {
    it('should return an array of notes for a user', async () => {
      const userId = 'testUserId';
      const expectedResult: NoteEntity[] = [
        {
          id: '4e7db261-695e-42bc-8cf4-f344e4556e1b',
          title: 'Hello world',
          content: 'ravind sdsdsds',
          userId: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
          user: {
            id: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
            username: 'ravidhaka',
            notes: [],
            password: 'sasas',
            email: 'xeee@gmail.com',
            name: 'ravindra..',
            phoneNumber: '+91857200033',
          },
        },
      ];

      jest.spyOn(noteRepository, 'find').mockResolvedValueOnce(expectedResult);

      const result = await service.findAllNotes(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findNoteById', () => {
    it('should return a note by ID for a user', async () => {
      const userId = 'testUserId';
      const noteId = 'testNoteId';
      const expectedResult: NoteEntity = {
        id: '4e7db261-695e-42bc-8cf4-f344e4556e1b',
        title: 'Hello world',
        content: 'ravind sdsdsds',
        userId: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
        user: {
          id: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
          username: 'ravidhaka',
          notes: [],
          password: 'sasas',
          email: 'xeee@gmail.com',
          name: 'ravindra..',
          phoneNumber: '+91857200033',
        },
      };

      jest
        .spyOn(service['noteRepository'], 'findOne')
        .mockResolvedValueOnce(expectedResult);

      const result = await service.findNoteById(noteId, userId);
      expect(result).toEqual(expectedResult);
    });

    it('should return null if the note is not found', async () => {
      const userId = 'testUserId';
      const nonExistentNoteId = 'nonExistentNoteId';

      jest
        .spyOn(service['noteRepository'], 'findOne')
        .mockResolvedValueOnce(null);

      const result = await service.findNoteById(nonExistentNoteId, userId);
      expect(result).toBeNull();
    });
  });

  describe('createNote', () => {
    it('should create a new note for a user', async () => {
      const userId = 'testUserId';
      const createNoteDto: CreateNoteDto = {
        title: 'New Note',
        content: 'Lorem Ipsum',
      };
      const expectedResult: NoteEntityInfo = {
        id: '1',
        title: 'New Note',
        content: 'Lorem Ipsum',
      };

      const expectedResult1: NoteEntity = {
        id: '4e7db261-695e-42bc-8cf4-f344e4556e1b',
        title: 'Hello world',
        content: 'ravind sdsdsds',
        userId: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
        user: {
          id: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
          username: 'ravidhaka',
          notes: [],
          password: 'sasas',
          email: 'xeee@gmail.com',
          name: 'ravindra..',
          phoneNumber: '+91857200033',
        },
      };

      jest
        .spyOn(service['noteRepository'], 'create')
        .mockReturnValueOnce(expectedResult1);
      jest
        .spyOn(service['noteRepository'], 'save')
        .mockResolvedValueOnce(expectedResult1);

      const result = await service.createNote(createNoteDto, userId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if a note with the same title already exists', async () => {
      const userId = 'testUserId';
      const createNoteDto: CreateNoteDto = {
        title: 'Duplicate Note',
        content: 'Lorem Ipsum',
      };

      const expectedResult: NoteEntity = {
        id: '4e7db261-695e-42bc-8cf4-f344e4556e1b',
        title: 'Hello world',
        content: 'ravind sdsdsds',
        userId: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
        user: {
          id: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
          username: 'ravidhaka',
          notes: [],
          password: 'sasas',
          email: 'xeee@gmail.com',
          name: 'ravindra..',
          phoneNumber: '+91857200033',
        },
      };

      jest
        .spyOn(service['noteRepository'], 'create')
        .mockReturnValueOnce(expectedResult);
      jest
        .spyOn(service['noteRepository'], 'save')
        .mockRejectedValueOnce({ message: 'ER_DUP_ENTRY' });

      await expect(
        service.createNote(createNoteDto, userId),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('updateNote', () => {
    it('should update an existing note by ID for a user', async () => {
      const userId = 'testUserId';
      const noteId = 'testNoteId';
      const updateNoteDto: UpdateNoteDto = {
        title: 'Updated Note',
        content: 'Updated Content',
      };
      const existingNote = {
        id: '1',
        title: 'Old Note',
        content: 'Old Content',
      };
      const expectedResult: NoteEntityInfo = {
        id: '1',
        title: 'Updated Note',
        content: 'Updated Content',
      };

      const expectedValue: NoteEntity = {
        id: '4e7db261-695e-42bc-8cf4-f344e4556e1b',
        title: 'Hello world',
        content: 'ravind sdsdsds',
        userId: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
        user: {
          id: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
          username: 'ravidhaka',
          notes: [],
          password: 'sasas',
          email: 'xeee@gmail.com',
          name: 'ravindra..',
          phoneNumber: '+91857200033',
        },
      };

      jest
        .spyOn(service['noteRepository'], 'findOne')
        .mockResolvedValueOnce(expectedValue);
      jest
        .spyOn(service['noteRepository'], 'save')
        .mockResolvedValueOnce(expectedValue);

      const result = await service.updateNote(noteId, updateNoteDto, userId);
      expect(result).toEqual(expectedResult);
    });

    it('should return null if the note to update is not found', async () => {
      const userId = 'testUserId';
      const nonExistentNoteId = 'nonExistentNoteId';
      const updateNoteDto: UpdateNoteDto = {
        title: 'Updated Note',
        content: 'Updated Content',
      };

      jest
        .spyOn(service['noteRepository'], 'findOne')
        .mockResolvedValueOnce(null);

      const result = await service.updateNote(
        nonExistentNoteId,
        updateNoteDto,
        userId,
      );
      expect(result).toBeNull();
    });
  });

  describe('deleteNoteById', () => {
    it('should delete a note by ID for a user', async () => {
      const userId = 'testUserId';
      const noteId = 'testNoteId';
      const existingNote = {
        id: '1',
        title: 'Note to Delete',
        content: 'Delete Me',
      };

      const expectedValue: NoteEntity = {
        id: '4e7db261-695e-42bc-8cf4-f344e4556e1b',
        title: 'Hello world',
        content: 'ravind sdsdsds',
        userId: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
        user: {
          id: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
          username: 'ravidhaka',
          notes: [],
          password: 'sasas',
          email: 'xeee@gmail.com',
          name: 'ravindra..',
          phoneNumber: '+91857200033',
        },
      };

      jest
        .spyOn(service['noteRepository'], 'findOne')
        .mockResolvedValueOnce(expectedValue);
      jest
        .spyOn(service['noteRepository'], 'remove')
        .mockResolvedValueOnce(undefined);

      const result = await service.deleteNoteById(noteId, userId);
      expect(result).toBeTruthy();
    });

    it('should return false if the note to delete is not found', async () => {
      const userId = 'testUserId';
      const nonExistentNoteId = 'nonExistentNoteId';

      jest
        .spyOn(service['noteRepository'], 'findOne')
        .mockResolvedValueOnce(null);

      const result = await service.deleteNoteById(nonExistentNoteId, userId);
      expect(result).toBeFalsy();
    });
  });

  describe('shareNoteWithUser', () => {
    it('should share a note with another user', async () => {
      const userId = 'testUserId';
      const noteId = 'testNoteId';
      const targetUserId = 'targetUserId';
      const note = {
        id: '1',
        title: 'Shared Note',
        content: 'Shared Content',
        user: { id: userId },
      };
      const targetUser = { id: '2', username: 'TargetUser' };
      const expectedResult: NoteEntityInfo = {
        id: '1',
        title: 'Shared Note',
        content: 'Shared Content',
      };

      const expectedValue: NoteEntity = {
        id: '4e7db261-695e-42bc-8cf4-f344e4556e1b',
        title: 'Hello world',
        content: 'ravind sdsdsds',
        userId: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
        user: {
          id: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
          username: 'ravidhaka',
          notes: [],
          password: 'sasas',
          email: 'xeee@gmail.com',
          name: 'ravindra..',
          phoneNumber: '+91857200033',
        },
      };

      const userEntity: UserEntity = {
        id: '',
        username: '',
        password: '',
        email: '',
        name: '',
        phoneNumber: '',
        notes: [],
      };

      jest
        .spyOn(service['noteRepository'], 'findOne')
        .mockResolvedValueOnce(expectedValue);
      jest
        .spyOn(service['usersService'], 'findByUserId')
        .mockResolvedValueOnce(userEntity);
      jest
        .spyOn(service['noteRepository'], 'save')
        .mockResolvedValueOnce(expectedValue);

      const result = await service.shareNoteWithUser(
        noteId,
        targetUserId,
        userId,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should return null if the note to share is not found', async () => {
      const userId = 'testUserId';
      const nonExistentNoteId = 'nonExistentNoteId';
      const targetUserId = 'targetUserId';

      jest
        .spyOn(service['noteRepository'], 'findOne')
        .mockResolvedValueOnce(null);

      const result = await service.shareNoteWithUser(
        nonExistentNoteId,
        targetUserId,
        userId,
      );
      expect(result).toBeNull();
    });

    it('should return null if the target user is not found', async () => {
      const userId = 'testUserId';
      const noteId = 'testNoteId';
      const targetUserId = 'nonExistentUserId';
      const note = {
        id: '1',
        title: 'Shared Note',
        content: 'Shared Content',
        user: { id: userId },
      };

      const expectedValue: NoteEntity = {
        id: '4e7db261-695e-42bc-8cf4-f344e4556e1b',
        title: 'Hello world',
        content: 'ravind sdsdsds',
        userId: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
        user: {
          id: '4e7db261-695e-42bc-8cf4-f344e4556e1a',
          username: 'ravidhaka',
          notes: [],
          password: 'sasas',
          email: 'xeee@gmail.com',
          name: 'ravindra..',
          phoneNumber: '+91857200033',
        },
      };

      jest
        .spyOn(service['noteRepository'], 'findOne')
        .mockResolvedValueOnce(expectedValue);
      jest
        .spyOn(service['usersService'], 'findByUserId')
        .mockResolvedValueOnce(null);

      const result = await service.shareNoteWithUser(
        noteId,
        targetUserId,
        userId,
      );
      expect(result).toBeNull();
    });
  });

  describe('searchNotes', () => {
    it('should return an array of notes based on the search query for a user', async () => {
      const userId = 'testUserId';
      const query = 'test';
      const expectedResult: NoteEntityInfo[] = [
        { id: '1', title: 'Test Note 1', content: 'Content 1' },
        { id: '2', title: 'Test Note 2', content: 'Content 2' },
      ];

      jest
        .spyOn(service['noteRepository'], 'createQueryBuilder')
        .mockReturnValueOnce({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValueOnce(expectedResult),
        } as any);

      const result = await service.searchNotes(query, userId);
      expect(result).toEqual(expectedResult);
    });
  });

  afterAll(async () => {
    // Cleanup resources, if needed
  });
});
