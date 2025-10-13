import { Test, TestingModule } from '@nestjs/testing';
import { RefundService } from './refund.service';
import { Refund } from './refund.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionsService } from '../../pos-transactions/transactions/transactions.service';
import { ShopService } from '../../shop/shop.service';
import { CounterService } from '../../counter/counter.service';
import { CustomerService } from '../../loyalty-management/customer/customer.service';
import { UsersService } from '../../users/users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockRefund: Partial<Refund> = {
  refund_id: 1,
  refund_number: 'R123',
  refund_amount: 100.0,
};

describe('RefundService', () => {
  let service: RefundService;
  let repo: Repository<Refund>;

  const mockRefundRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockTransactionService = { findOne: jest.fn() };
  const mockShopService = { findOne: jest.fn() };
  const mockCounterService = { findOne: jest.fn() };
  const mockCustomerService = { findOne: jest.fn() };
  const mockUserService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefundService,
        { provide: getRepositoryToken(Refund), useValue: mockRefundRepo },
        { provide: TransactionsService, useValue: mockTransactionService },
        { provide: ShopService, useValue: mockShopService },
        { provide: CounterService, useValue: mockCounterService },
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<RefundService>(RefundService);
    repo = module.get<Repository<Refund>>(getRepositoryToken(Refund));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw ConflictException if refund number already exists', async () => {
      mockRefundRepo.findOne.mockResolvedValue(mockRefund);

      await expect(
        service.create({ refund_number: 'R123', original_transaction_id: 1, refund_date: '2025-01-01', refund_amount: 100, refund_reason: 'DEFECTIVE', refund_type: 'FULL', refund_method: 'CASH' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if transaction not found', async () => {
      mockRefundRepo.findOne.mockResolvedValue(null);
      mockTransactionService.findOne.mockResolvedValue(null);

      await expect(
        service.create({ refund_number: 'R124', original_transaction_id: 999, refund_date: '2025-01-01', refund_amount: 50, refund_reason: 'WRONG_ITEM', refund_type: 'PARTIAL', refund_method: 'CARD' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create and save refund successfully', async () => {
      mockRefundRepo.findOne.mockResolvedValue(null);
      mockTransactionService.findOne.mockResolvedValue({ id: 1 });
      mockRefundRepo.create.mockReturnValue(mockRefund);
      mockRefundRepo.save.mockResolvedValue(mockRefund);

      const result = await service.create({ refund_number: 'R125', original_transaction_id: 1, refund_date: '2025-01-01', refund_amount: 100, refund_reason: 'CUSTOMER_REQUEST', refund_type: 'FULL', refund_method: 'CASH' } as any);

      expect(result).toEqual(mockRefund);
      expect(mockRefundRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all refunds', async () => {
      mockRefundRepo.find.mockResolvedValue([mockRefund]);

      const result = await service.findAll();
      expect(result).toEqual([mockRefund]);
    });
  });

  describe('findOne', () => {
    it('should return one refund', async () => {
      mockRefundRepo.findOne.mockResolvedValue(mockRefund);

      const result = await service.findOne(1);
      expect(result).toEqual(mockRefund);
    });

    it('should throw NotFoundException if refund not found', async () => {
      mockRefundRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });
});
