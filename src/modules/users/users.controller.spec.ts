import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from './users.entity';

jest.mock('./users.service');
jest.mock('../auth/auth.service');

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, AuthService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should create a new user and return success message', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+1234567890',
      };

      const UserEntityMock: UserEntity = {
        id: '108ba87a-d58a-4c7c-808b-265d4c34a6e7',
        username: 'sasas',
        password: 'sasasa',
        email: 'sasasa@gmail.com',
        name: 'ravindra dhaka ',
        phoneNumber: '+918572003844',
        notes: [],
      };

      jest.spyOn(usersService, 'create').mockResolvedValueOnce(UserEntityMock);

      const result = await controller.signUp(createUserDto);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({ message: 'User created successfully' });
    });
  });

  describe('login', () => {
    it('should return access token after successful login', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      jest
        .spyOn(authService, 'login')
        .mockResolvedValueOnce({ access_token: 'testAccessToken' });

      const result = await controller.login(loginUserDto);
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
      expect(result).toEqual({ access_token: 'testAccessToken' });
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const mockUser = { id: 'testUserId', username: 'testuser' };
      const mockRequest = { user: mockUser };

      const result = controller.getProfile(mockRequest);
      expect(result).toEqual(mockUser);
    });
  });

  describe('signUp', () => {
    it('should create a new user and return success message', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+1234567890',
      };

      const UserEntityMock: UserEntity = {
        id: '108ba87a-d58a-4c7c-808b-265d4c34a6e7',
        username: 'sasas',
        password: 'sasasa',
        email: 'sasasa@gmail.com',
        name: 'ravindra dhaka ',
        phoneNumber: '+918572003844',
        notes: [],
      };

      jest.spyOn(usersService, 'create').mockResolvedValueOnce(UserEntityMock);

      const result = await controller.signUp(createUserDto);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({ message: 'User created successfully' });
    });

    it('should handle user creation failure', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+1234567890',
      };

      jest
        .spyOn(usersService, 'create')
        .mockRejectedValueOnce(new Error('User creation failed'));

      await expect(controller.signUp(createUserDto)).rejects.toThrowError(
        'User creation failed',
      );
    });
  });

  describe('login', () => {
    it('should return access token after successful login', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      jest
        .spyOn(authService, 'login')
        .mockResolvedValueOnce({ access_token: 'testAccessToken' });

      const result = await controller.login(loginUserDto);
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
      expect(result).toEqual({ access_token: 'testAccessToken' });
    });

    it('should handle login failure', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValueOnce(new Error('Login failed'));

      await expect(controller.login(loginUserDto)).rejects.toThrowError(
        'Login failed',
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const mockUser = { id: 'testUserId', username: 'testuser' };
      const mockRequest = { user: mockUser };

      const result = controller.getProfile(mockRequest);
      expect(result).toEqual(mockUser);
    });
  });

  // Add more test cases as needed

  afterAll(async () => {
    jest.clearAllMocks();
  });
});
