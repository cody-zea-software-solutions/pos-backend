import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyPointsService } from './loyalty-points.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoyaltyPoints } from './loyalty-points.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { ShopService } from '../../shop/shop.service';
import { CounterService } from '../../counter/counter.service';
import { UsersService } from '../../users/users.service';

describe('LoyaltyPointsService', () => {
  let service: LoyaltyPointsService;
  let repo: Repository<LoyaltyPoints>;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCustomerService = { findOne: jest.fn() };
  const mockShopService = { findOne: jest.fn() };
  const mockCounterService = { findOne: jest.fn() };
  const mockUsersService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyPointsService,
        { provide: getRepositoryToken(LoyaltyPoints), useValue: mockRepo },
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: ShopService, useValue: mockShopService },
        { provide: CounterService, useValue: mockCounterService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<LoyaltyPointsService>(LoyaltyPointsService);
    repo = module.get<Repository<LoyaltyPoints>>(getRepositoryToken(LoyaltyPoints));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 🔍 findAll
  describe('findAll', () => {
    it('should return all loyalty points', async () => {
      const mockData = [{ point_id: 1 }];
      mockRepo.find.mockResolvedValue(mockData);

      const result = await service.findAll();
      expect(result).toEqual(mockData);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  // 🔍 findOne
  describe('findOne', () => {
    it('should return a record if found', async () => {
      const mockRecord = { point_id: 1 };
      mockRepo.findOne.mockResolvedValue(mockRecord);

      const result = await service.findOne(1);
      expect(result).toEqual(mockRecord);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  // 🗑 remove
  describe('remove', () => {
    it('should call repo.remove after finding record', async () => {
      const mockRecord = { point_id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRecord as any);
      mockRepo.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockRepo.remove).toHaveBeenCalledWith(mockRecord);
    });
  });

  // 🧮 recordFromTransaction
  describe('recordFromTransaction', () => {
    const transaction = {
      transaction_number: 'TXN001',
      transaction_type: 'SALE',
      transaction_date: new Date(),
      customer: { id: 1 },
      shop: { id: 2 },
      counter: { id: 3 },
      processed_by: { user_id: 10 },
    } as any;

    it('should create and save loyalty points successfully', async () => {
      mockRepo.create.mockReturnValue({ point_id: 1 });
      mockRepo.save.mockResolvedValue({ point_id: 1 });

      const result = await service.recordFromTransaction({
        transaction,
        points_earned: 20,
      });

      expect(result.point_id).toBe(1);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('should throw if transaction has no customer', async () => {
      const badTransaction = { ...transaction, customer: null };
      await expect(
        service.recordFromTransaction({ transaction: badTransaction }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
