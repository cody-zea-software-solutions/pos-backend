import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ShopService } from '../../shop/shop.service';
import { CounterService } from '../../counter/counter.service';
import { CustomerService } from '../../loyalty-management/customer/customer.service';
import { UsersService } from '../../users/users.service';
import { LoyaltyLevelsService } from '../../loyalty-management/loyalty-levels/loyalty-levels.service';
import { LoyaltyPointsService } from '../../loyalty-management/loyalty-points/loyalty-points.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repo: Repository<Transaction>;

  // Mock dependencies
  const mockRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockShopService = { findOne: jest.fn() };
  const mockCounterService = { findOne: jest.fn() };
  const mockCustomerService = {
    findOne: jest.fn(),
    updateAfterTransaction: jest.fn(),
  };
  const mockUserService = { findOne: jest.fn() };
  const mockLoyaltyLevelService = { findOne: jest.fn() };
  const mockLoyaltyPointsService = { recordFromTransaction: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getRepositoryToken(Transaction), useValue: mockRepo },
        { provide: ShopService, useValue: mockShopService },
        { provide: CounterService, useValue: mockCounterService },
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: UsersService, useValue: mockUserService },
        { provide: LoyaltyLevelsService, useValue: mockLoyaltyLevelService },
        { provide: LoyaltyPointsService, useValue: mockLoyaltyPointsService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repo = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateTransactionDto = {
      transaction_number: 'TXN001',
      shop_id: 1,
      counter_id: 2,
      customer_id: 3,
      processed_by_user: 4,
      subtotal: 1000,
      loyalty_points_earned: 10,
      loyalty_points_redeemed: 0,
    } as any;

    it('should throw ConflictException if transaction number exists', async () => {
      mockRepo.findOne.mockResolvedValue({ transaction_number: 'TXN001' });
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(mockRepo.findOne).toHaveBeenCalled();
    });

    it('should create and save a new transaction successfully', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue({ ...dto });
      mockRepo.save.mockResolvedValue({
        ...dto,
        transaction_id: 1,
        loyalty_points_earned: 15,
      });

      mockShopService.findOne.mockResolvedValue({ shop_id: 1 });
      mockCounterService.findOne.mockResolvedValue({ counter_id: 2 });
      mockCustomerService.findOne.mockResolvedValue({
        customer_id: 3,
        current_level_id: 1,
      });
      mockUserService.findOne.mockResolvedValue({ user_id: 4 });
      mockLoyaltyLevelService.findOne.mockResolvedValue({ points_rate: 0.01 });

      const result = await service.create(dto);

      expect(result.transaction_id).toBe(1);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
      expect(mockLoyaltyPointsService.recordFromTransaction).toHaveBeenCalled();
      expect(mockCustomerService.updateAfterTransaction).toHaveBeenCalled();
    });

    it('should handle customers without loyalty levels gracefully', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue({ ...dto });
      mockRepo.save.mockResolvedValue({ ...dto, transaction_id: 2 });
      mockShopService.findOne.mockResolvedValue({ shop_id: 1 });
      mockCounterService.findOne.mockResolvedValue({ counter_id: 2 });
      mockCustomerService.findOne.mockResolvedValue({
        customer_id: 3,
        current_level_id: null,
      });
      mockUserService.findOne.mockResolvedValue({ user_id: 4 });
      mockLoyaltyLevelService.findOne.mockRejectedValue(new Error('No level'));

      await expect(service.create(dto)).resolves.not.toThrow();
    });
  });

  describe('findOne', () => {
    it('should return a transaction if found', async () => {
      const mockTransaction = { transaction_id: 1 };
      mockRepo.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne(1);
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByReceiptNumber', () => {
    it('should return a transaction by receipt number', async () => {
      const mockTransaction = { receipt_number: 'R001' };
      mockRepo.findOne.mockResolvedValue(mockTransaction);
      const result = await service.findByReceiptNumber('R001');
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(
        service.findByReceiptNumber('INVALID'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const mockTransactions = [{ id: 1 }, { id: 2 }];
      mockRepo.find.mockResolvedValue(mockTransactions);
      const result = await service.findAll();
      expect(result).toEqual(mockTransactions);
    });
  });
});
