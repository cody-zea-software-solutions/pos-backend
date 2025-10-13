import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByReceiptNumber: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should call service.create and return result', async () => {
      const dto = { transaction_number: 'TXN001', total_amount: 100 };
      const result = { transaction_id: 1, ...dto };
      mockTransactionsService.create.mockResolvedValue(result);

      expect(await controller.create(dto as any)).toEqual(result);
      expect(mockTransactionsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const result = [{ transaction_id: 1 }];
      mockTransactionsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockTransactionsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one transaction by ID', async () => {
      const result = { transaction_id: 1 };
      mockTransactionsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockTransactionsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findByReceiptNumber', () => {
    it('should return transaction by receipt number', async () => {
      const result = { receipt_number: 'RCPT123' };
      mockTransactionsService.findByReceiptNumber.mockResolvedValue(result);

      expect(await controller.findByReceiptNumber('RCPT123')).toEqual(result);
      expect(mockTransactionsService.findByReceiptNumber).toHaveBeenCalledWith('RCPT123');
    });
  });
});
