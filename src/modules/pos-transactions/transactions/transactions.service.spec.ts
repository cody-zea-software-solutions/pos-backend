import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import { ShopService } from '../../shop/shop.service';
import { CounterService } from '../../counter/counter.service';
import { CustomerService } from '../../loyalty-management/customer/customer.service';
import { UsersService } from '../../users/users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repo: Repository<Transaction>;

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockShopService = { findOne: jest.fn() };
  const mockCounterService = { findOne: jest.fn() };
  const mockCustomerService = { findOne: jest.fn() };
  const mockUserService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getRepositoryToken(Transaction), useValue: mockRepo },
        { provide: ShopService, useValue: mockShopService },
        { provide: CounterService, useValue: mockCounterService },
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repo = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    const dto = {
      transaction_number: 'TXN123',
      shop_id: 1,
      counter_id: 2,
      customer_id: 3,
      processed_by_user: 4,
      transaction_date: new Date(),
      subtotal: 100,
      tax_amount: 10,
      discount_amount: 5,
      total_amount: 105,
      paid_amount: 105,
      change_amount: 0,
      payment_status: 'PAID',
      transaction_type: 'SALE',
      is_loyalty_applied: false,
      loyalty_points_earned: 0,
      loyalty_points_redeemed: 0,
      has_consignment_items: false,
      consignment_commission: 0,
      is_gst_applicable: false,
      total_cgst: 0,
      total_sgst: 0,
      total_igst: 0,
      total_cess: 0,
      is_b2b_transaction: false,
    };

    it('should throw ConflictException if transaction number already exists', async () => {
      mockRepo.findOne.mockResolvedValue({ transaction_number: 'TXN123' });
      await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
    });

    it('should create and save transaction successfully', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockShopService.findOne.mockResolvedValue({ id: 1 });
      mockCounterService.findOne.mockResolvedValue({ id: 2 });
      mockCustomerService.findOne.mockResolvedValue({ id: 3 });
      mockUserService.findOne.mockResolvedValue({ id: 4 });
      const mockTransaction = { transaction_id: 1, ...dto };
      mockRepo.create.mockReturnValue(mockTransaction);
      mockRepo.save.mockResolvedValue(mockTransaction);

      const result = await service.create(dto as any);
      expect(result).toEqual(mockTransaction);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const transactions = [{ transaction_id: 1 }];
      mockRepo.find.mockResolvedValue(transactions);
      expect(await service.findAll()).toEqual(transactions);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a transaction if found', async () => {
      const transaction = { transaction_id: 1 };
      mockRepo.findOne.mockResolvedValue(transaction);
      expect(await service.findOne(1)).toEqual(transaction);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByReceiptNumber', () => {
    it('should return transaction by receipt number', async () => {
      const transaction = { receipt_number: 'RCPT123' };
      mockRepo.findOne.mockResolvedValue(transaction);
      expect(await service.findByReceiptNumber('RCPT123')).toEqual(transaction);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findByReceiptNumber('NOT_FOUND')).rejects.toThrow(NotFoundException);
    });
  });
});
