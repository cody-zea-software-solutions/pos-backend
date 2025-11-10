import { Test, TestingModule } from '@nestjs/testing';
import { CashDrawerTransactionController } from './cash-drawer-transaction.controller';
import { CashDrawerTransactionService } from './cash-drawer-transaction.service';
import { CreateCashDrawerTransactionDto } from './dto/create-cash-drawer-transaction.dto';
import { TransactionType } from './cash-drawer-transaction-type.enum';
describe('CashDrawerTransactionController', () => {
  let controller: CashDrawerTransactionController;
  let service: CashDrawerTransactionService;

  const mockTransaction = {
    drawer_transaction_id: 1,
    counter: { counter_id: 1 },
    shift: { shift_id: 1 },
    transaction_type: TransactionType.CASH_IN,
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

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashDrawerTransactionController],
      providers: [
        {
          provide: CashDrawerTransactionService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CashDrawerTransactionController>(CashDrawerTransactionController);
    service = module.get<CashDrawerTransactionService>(CashDrawerTransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return transaction', async () => {
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
      mockService.create.mockResolvedValue(mockTransaction);
      const result = await controller.create(dto);
      expect(result).toEqual(mockTransaction);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return array', async () => {
      mockService.findAll.mockResolvedValue([mockTransaction]);
      const result = await controller.findAll();
      expect(result).toEqual([mockTransaction]);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return transaction', async () => {
      mockService.findOne.mockResolvedValue(mockTransaction);
      const id = 1;
      const result = await controller.findOne(id);
      expect(result).toEqual(mockTransaction);
      expect(mockService.findOne).toHaveBeenCalledWith(id);
    });
  });
});
