import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: Repository<UserEntity>;

  const mockRecipeRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRecipeRepository,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user and return the user entity', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword@123',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+1234567890',
      };

      const existingUser = null;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUser);

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const expectedUserEntity: UserEntity = {
        id: '1',
        username: createUserDto.username,
        password: hashedPassword,
        email: createUserDto.email,
        name: createUserDto.name,
        phoneNumber: createUserDto.phoneNumber,
        notes: [],
      };

      jest
        .spyOn(userRepository, 'create')
        .mockReturnValueOnce(expectedUserEntity);
      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValueOnce(expectedUserEntity);

      const result = await userService.create(createUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: createUserDto.username },
      });
      expect(userRepository.save).toHaveBeenCalledTimes(1);

      expect(result).toEqual(expectedUserEntity);
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username if it exists', async () => {
      const username = 'testuser';
      const expectedUserEntity: UserEntity = {
        id: '1',
        username,
        password: 'hashedPassword',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+1234567890',
        notes: [],
      };

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(expectedUserEntity);

      const result = await userService.findByUsername(username);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toEqual(expectedUserEntity);
    });

    it('should return null if the user by username does not exist', async () => {
      const username = 'nonexistentuser';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await userService.findByUsername(username);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return a user by userId if it exists', async () => {
      const userId = '1';
      const expectedUserEntity: UserEntity = {
        id: userId,
        username: 'testuser',
        password: 'hashedPassword',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+1234567890',
        notes: [],
      };

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(expectedUserEntity);

      const result = await userService.findByUserId(userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(expectedUserEntity);
    });

    it('should return null if the user by userId does not exist', async () => {
      const userId = 'nonexistentid';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await userService.findByUserId(userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toBeNull();
    });
  });

  // Add more test cases if needed

  afterAll(async () => {
    // Cleanup resources, if needed
  });
});
