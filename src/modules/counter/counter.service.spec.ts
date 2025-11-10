import { Test, TestingModule } from '@nestjs/testing';
import { CounterService } from './counter.service';
import { Counter } from './counter.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopService } from '../shop/shop.service';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';
import { CreateCounterDto } from './dto/create-counter.dto';
import { UpdateCounterDto } from './dto/update-counter.dto';

describe('CounterService', () => {
  let service: CounterService;
  let repo: Repository<Counter>;
  let shopService: ShopService;
  let usersService: UsersService;

  const mockCounter = {
    counter_id: 1,
    counter_code: 'CNT001',
    counter_name: 'Main Counter',
  } as Counter;

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockCounter),
    save: jest.fn().mockResolvedValue(mockCounter),
    find: jest.fn().mockResolvedValue([mockCounter]),
    findOne: jest.fn(),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  const mockShopService = {
    findOne: jest.fn().mockResolvedValue({ shop_id: 1, shop_name: 'Shop A' }),
  };

  const mockUsersService = {
    findOne: jest.fn().mockResolvedValue({ user_id: 1, username: 'admin' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CounterService,
        { provide: getRepositoryToken(Counter), useValue: mockRepo },
        { provide: ShopService, useValue: mockShopService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<CounterService>(CounterService);
    repo = module.get<Repository<Counter>>(getRepositoryToken(Counter));
    shopService = module.get<ShopService>(ShopService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create and return a counter', async () => {
      const dto: CreateCounterDto = {
        counter_name: 'Main Counter',
        counter_code: 'CNT001',
        shop: 1,
        current_user: 1,
      } as any;

      const result = await service.create(dto);

      expect(shopService.findOne).toHaveBeenCalledWith(1);
      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ counter_name: 'Main Counter' }));
      expect(result).toEqual(mockCounter);
    });

    it('should throw NotFoundException if shop not found', async () => {
      mockShopService.findOne.mockResolvedValueOnce(null);
      const dto: CreateCounterDto = { counter_name: 'Test', shop: 999 } as any;

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll()', () => {
    it('should return all counters', async () => {
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith({
        relations: ['shop', 'current_user', 'rollback_by_user'],
      });
      expect(result).toEqual([mockCounter]);
    });
  });

  describe('findOne()', () => {
    it('should return a counter by id', async () => {
      mockRepo.findOne.mockResolvedValueOnce(mockCounter);
      const result = await service.findOne(1);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { counter_id: 1 },
        relations: ['shop', 'current_user', 'rollback_by_user'],
      });
      expect(result).toEqual(mockCounter);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update a counter', async () => {
      const dto: UpdateCounterDto = { counter_name: 'Updated Counter' } as any;
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockCounter);
      const result = await service.update(1, dto);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ counter_name: 'Updated Counter' }));
      expect(result).toEqual(mockCounter);
    });
  });

  describe('remove()', () => {
    it('should remove a counter', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockCounter);
      await service.remove(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repo.remove).toHaveBeenCalledWith(mockCounter);
    });
  });

  describe('findByCode()', () => {
    it('should return a counter by code', async () => {
      mockRepo.findOne.mockResolvedValueOnce(mockCounter);
      const result = await service.findByCode('CNT001');
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { counter_code: 'CNT001' },
        relations: ['shop', 'current_user'],
      });
      expect(result).toEqual(mockCounter);
    });

    it('should return null if not found', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);
      const result = await service.findByCode('INVALID');
      expect(result).toBeNull();
    });
  });
});
