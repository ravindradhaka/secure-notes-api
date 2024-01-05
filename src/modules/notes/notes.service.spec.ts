import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { NoteEntity } from './notes.entity';
import { UserEntity } from '../users/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { NoteEntityInfo } from './response/note.entity.response';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';

describe('NotesService', () => {
  let notesService: NotesService;
  let noteRepository: Repository<NoteEntity>;

  const mockNoteRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        UsersService,
        // Provide the repository token for both NoteEntity and UserEntity
        {
          provide: getRepositoryToken(NoteEntity),
          useValue: mockNoteRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockNoteRepository, // You may need to mock UserEntityRepository methods
        },
      ],
    }).compile();

    notesService = module.get<NotesService>(NotesService);
    noteRepository = module.get<Repository<NoteEntity>>(
      getRepositoryToken(NoteEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
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

      const result = await notesService.findAllNotes(userId);
      const resultObject: NoteEntityInfo[] = [];
      result.map((resp) => {
        resultObject.push({
          id: resp.id,
          title: resp.title,
          content: resp.content,
        });
      });
      expect(result).toEqual(resultObject);
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
        .spyOn(notesService['noteRepository'], 'findOne')
        .mockResolvedValueOnce(expectedResult);

      const result = await notesService.findNoteById(noteId, userId);
      const resultObject: NoteEntityInfo = {
        id: '4e7db261-695e-42bc-8cf4-f344e4556e1b',
        title: 'Hello world',
        content: 'ravind sdsdsds',
      };
      expect(result).toEqual(resultObject);
    });

    it('should return null if the note is not found', async () => {
      const userId = 'testUserId';
      const nonExistentNoteId = 'nonExistentNoteId';

      jest
        .spyOn(notesService['noteRepository'], 'findOne')
        .mockResolvedValueOnce(null);

      try {
      } catch (error) {
        expect(String(error)).toEqual(
          'NotFoundException: Note with the this Id.',
        );
      }
    });
  });

  describe('createNote', () => {
    it('should create a new note for a user', async () => {
      const userId = 'testUserId';
      const createNoteDto: CreateNoteDto = {
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

      const expectedResp: NoteEntityInfo = {
        id: '4e7db261-695e-42bc-8cf4-f344e4556e1b',
        title: 'Hello world',
        content: 'ravind sdsdsds',
      };

      jest
        .spyOn(notesService['noteRepository'], 'create')
        .mockReturnValueOnce(expectedResult1);
      jest
        .spyOn(notesService['noteRepository'], 'save')
        .mockResolvedValueOnce(expectedResult1);

      const result = await notesService.createNote(createNoteDto, userId);
      expect(result).toEqual(expectedResp);
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
        .spyOn(notesService['noteRepository'], 'create')
        .mockReturnValueOnce(expectedResult);
      jest
        .spyOn(notesService['noteRepository'], 'save')
        .mockRejectedValueOnce({ message: 'ER_DUP_ENTRY' });

      try {
        await notesService.createNote(createNoteDto, userId);
      } catch (error) {
        expect(error).toEqual({ message: 'ER_DUP_ENTRY' });
      }
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
      const expectedResult: NoteEntityInfo = {
        id: '4e7db261-695e-42bc-8cf4-f344e4556e1b',
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
        .spyOn(notesService['noteRepository'], 'findOne')
        .mockResolvedValueOnce(expectedValue);
      jest
        .spyOn(notesService['noteRepository'], 'save')
        .mockResolvedValueOnce(expectedValue);

      const result = await notesService.updateNote(
        noteId,
        updateNoteDto,
        userId,
      );
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
        .spyOn(notesService['noteRepository'], 'findOne')
        .mockResolvedValueOnce(null);

      const result = await notesService.updateNote(
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
        .spyOn(notesService['noteRepository'], 'findOne')
        .mockResolvedValueOnce(expectedValue);
      jest
        .spyOn(notesService['noteRepository'], 'remove')
        .mockResolvedValueOnce(expectedValue);

      const result = await notesService.deleteNoteById(noteId, userId);
      expect(result).toBeTruthy();
    });

    it('should return false if the note to delete is not found', async () => {
      const userId = 'testUserId';
      const nonExistentNoteId = 'nonExistentNoteId';

      jest
        .spyOn(notesService['noteRepository'], 'findOne')
        .mockResolvedValueOnce(null);

      const result = await notesService.deleteNoteById(
        nonExistentNoteId,
        userId,
      );
      expect(result).toBeFalsy();
    });
  });

  describe('shareNoteWithUser', () => {
    it('should share a note with another user', async () => {
      const userId = 'testUserId';
      const noteId = 'testNoteId';
      const targetUserId = 'targetUserId';
      const expectedResult: NoteEntityInfo = {
        id: '4e7db261-695e-42bc-8cf4-f344e4556e1b',
        title: 'Hello world',
        content: 'ravind sdsdsds',
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
        .spyOn(notesService['noteRepository'], 'findOne')
        .mockResolvedValueOnce(expectedValue);
      jest
        .spyOn(notesService['usersService'], 'findByUserId')
        .mockResolvedValueOnce(userEntity);
      jest
        .spyOn(notesService['noteRepository'], 'save')
        .mockResolvedValueOnce(expectedValue);

      const result = await notesService.shareNoteWithUser(
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
        .spyOn(notesService['noteRepository'], 'findOne')
        .mockResolvedValueOnce(null);

      const result = await notesService.shareNoteWithUser(
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
        .spyOn(notesService['noteRepository'], 'findOne')
        .mockResolvedValueOnce(expectedValue);
      jest
        .spyOn(notesService['usersService'], 'findByUserId')
        .mockResolvedValueOnce(null);

      const result = await notesService.shareNoteWithUser(
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
        .spyOn(notesService['noteRepository'], 'createQueryBuilder')
        .mockReturnValueOnce({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValueOnce(expectedResult),
        } as any);

      const result = await notesService.searchNotes(query, userId);
      expect(result).toEqual(expectedResult);
    });
  });

  afterAll(async () => {
    // Cleanup resources, if needed
  });
});
