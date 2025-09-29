import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ShopService } from '../shop/shop.service';
import { UserRole } from './user-role.enum';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;
  let shopService: ShopService;

  const mockUserRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
  };

  const mockShopService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: ShopService, useValue: mockShopService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    shopService = module.get<ShopService>(ShopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto = {
        username: 'john',
        email: 'john@example.com',
        password: '123456',
        first_name: 'John',
        last_name: 'Doe',
        role: UserRole.CASHIER,
        assigned_shop_id: 1,
      };

      mockUserRepo.findOne.mockResolvedValueOnce(null); // username
      mockUserRepo.findOne.mockResolvedValueOnce(null); // email
      mockShopService.findOne.mockResolvedValue({ shop_id: 1 });
      mockUserRepo.create.mockReturnValue(dto);
      mockUserRepo.save.mockResolvedValue({ ...dto, user_id: 1 });

      const result = await service.create(dto);
      expect(result.user_id).toEqual(1);
    });

    it('should throw ConflictException if username exists', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce({ username: 'john' });
      await expect(service.create({ username: 'john' } as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if shop not found', async () => {
      mockUserRepo.findOne.mockResolvedValueOnce(null); // username
      mockUserRepo.findOne.mockResolvedValueOnce(null); // email
      mockShopService.findOne.mockResolvedValue(null);
      await expect(
        service.create({
          username: 'john',
          email: 'john@example.com',
          password: '123456',
          role: UserRole.CASHIER,
          assigned_shop_id: 1,
        } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
