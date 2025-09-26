import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create with dto', async () => {
    const dto: CreateUserDto = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      role: 'admin',
    };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.findAll', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne with id', async () => {
    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should call service.update with id and dto', async () => {
    const dto: UpdateUserDto = { first_name: 'Jane' };
    await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call service.remove with id', async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
