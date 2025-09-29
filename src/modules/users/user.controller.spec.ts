import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './user-role.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateUserDto = {
        username: 'john',
        email: 'john@example.com',
        password: '123456',
        first_name: 'John',
        last_name: 'Doe',
        role: UserRole.CASHIER,
      };

      mockUsersService.create.mockResolvedValue({ ...dto, user_id: 1 });

      expect(await controller.create(dto)).toEqual({ ...dto, user_id: 1 });
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ user_id: 1 }];
      mockUsersService.findAll.mockResolvedValue(result);
      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = { user_id: 1 };
      mockUsersService.findOne.mockResolvedValue(result);
      expect(await controller.findOne(1)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const dto: UpdateUserDto = { first_name: 'Jane' };
      const result = { user_id: 1, ...dto };
      mockUsersService.update.mockResolvedValue(result);
      expect(await controller.update(1, dto)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);
      await controller.remove(1);
      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });
  });
});
