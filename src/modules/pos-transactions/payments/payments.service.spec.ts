import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from '../../users/users.service';
import { NotFoundException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let repo: Repository<Payment>;
  let transactionsService: TransactionsService;
  let usersService: UsersService;

  const mockPaymentRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockTransactionsService = {
    findOne: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: getRepositoryToken(Payment), useValue: mockPaymentRepo },
        { provide: TransactionsService, useValue: mockTransactionsService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    repo = module.get<Repository<Payment>>(getRepositoryToken(Payment));
    transactionsService = module.get<TransactionsService>(TransactionsService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create and save a payment successfully', async () => {
      const dto = {
        transaction_id: 1,
        payment_method: 'CARD',
        amount: 100,
        processed_by_user: 2,
      };

      const mockTransaction = { transaction_id: 1 };
      const mockUser = { user_id: 2 };
      const mockPayment = { payment_id: 1, ...dto };

      mockTransactionsService.findOne.mockResolvedValue(mockTransaction);
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockPaymentRepo.create.mockReturnValue(mockPayment);
      mockPaymentRepo.save.mockResolvedValue(mockPayment);

      const result = await service.create(dto as any);
      expect(result).toEqual(mockPayment);
      expect(mockPaymentRepo.create).toHaveBeenCalled();
      expect(mockPaymentRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if transaction not found', async () => {
      mockTransactionsService.findOne.mockResolvedValue(null);
      await expect(
        service.create({
          transaction_id: 1,
          payment_method: 'CARD',
          amount: 100,
        } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of payments', async () => {
      const payments = [{ payment_id: 1 }];
      mockPaymentRepo.find.mockResolvedValue(payments);
      expect(await service.findAll()).toEqual(payments);
    });
  });

  describe('findOne', () => {
    it('should return a payment by ID', async () => {
      const payment = { payment_id: 1 };
      mockPaymentRepo.findOne.mockResolvedValue(payment);
      expect(await service.findOne(1)).toEqual(payment);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPaymentRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
