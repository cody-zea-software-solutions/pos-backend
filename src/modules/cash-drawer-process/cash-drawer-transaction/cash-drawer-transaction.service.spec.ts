import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashDrawerTransaction } from './cash-drawer-transaction.entity';
import { CashDrawerTransactionService } from './cash-drawer-transaction.service';
import { CreateCashDrawerTransactionDto } from './dto/create-cash-drawer-transaction.dto';
import { TransactionType } from './cash-drawer-transaction-type.enum';
const mockTransaction = {
  drawer_transaction_id: 1,
  counter: { counter_id: 1 },
  shift: { shift_id: 1 },
  transaction_type: 'CASH_IN',
  amount: 100.0,
  balance_before: 500.0,
  balance_after: 600.0,
  reference_number: 'REF123',
  reason: 'Test Reason',
  transaction_time: new Date(),
  performed_by_user: { user_id: 1 },
  authorized_by_user: { user_id: 2 },
  status: 'ACTIVE',
  notes: 'Test notes',
};

describe('CashDrawerTransactionService', () => {
  let service: CashDrawerTransactionService;
  let repo: Repository<CashDrawerTransaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashDrawerTransactionService,
        {
          provide: getRepositoryToken(CashDrawerTransaction),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CashDrawerTransactionService>(CashDrawerTransactionService);
    repo = module.get<Repository<CashDrawerTransaction>>(getRepositoryToken(CashDrawerTransaction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a transaction', async () => {
      const dto: CreateCashDrawerTransactionDto = {
        counter_id: 1,
        shift_id: 1,
       transaction_type: TransactionType.CASH_IN,
        amount: 100,
        balance_before: 500,
        balance_after: 600,
        performed_by_user: 1,
        authorized_by_user: 2,
        reference_number: 'REF123',
        reason: 'Test Reason',
        status: 'ACTIVE',
        notes: 'Test notes',
      };

      jest.spyOn(repo, 'save').mockResolvedValue(mockTransaction as any);

      const result = await service.create(dto);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      jest.spyOn(repo, 'find').mockResolvedValue([mockTransaction] as any);
      const result = await service.findAll();
      expect(result).toEqual([mockTransaction]);
    });
  });

  describe('findOne', () => {
    it('should return a transaction if found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockTransaction as any);
      const result = await service.findOne(1);
      expect(result).toEqual(mockTransaction);
    });

    it('should return null if transaction not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });
});
