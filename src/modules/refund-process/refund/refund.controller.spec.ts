import { Test, TestingModule } from '@nestjs/testing';
import { RefundController } from './refund.controller';
import { RefundService } from './refund.service';
import { CreateRefundDto } from './dto/create-refund.dto';

describe('RefundController', () => {
  let controller: RefundController;
  let service: RefundService;

  const mockRefundService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefundController],
      providers: [
        { provide: RefundService, useValue: mockRefundService },
      ],
    }).compile();

    controller = module.get<RefundController>(RefundController);
    service = module.get<RefundService>(RefundService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateRefundDto = {
        refund_number: 'R200',
        original_transaction_id: 1,
        refund_date: '2025-01-01',
        refund_amount: 100,
        refund_reason: 'DEFECTIVE' as any,
        refund_type: 'FULL' as any,
        refund_method: 'CASH' as any,
      };

      mockRefundService.create.mockResolvedValue(dto);

      const result = await controller.create(dto);
      expect(result).toEqual(dto);
      expect(mockRefundService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all refunds', async () => {
      const mockRefunds = [{ refund_id: 1 }];
      mockRefundService.findAll.mockResolvedValue(mockRefunds);

      const result = await controller.findAll();
      expect(result).toEqual(mockRefunds);
    });
  });

  describe('findOne', () => {
    it('should return one refund', async () => {
      const mockRefund = { refund_id: 1 };
      mockRefundService.findOne.mockResolvedValue(mockRefund);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockRefund);
      expect(mockRefundService.findOne).toHaveBeenCalledWith(1);
    });
  });
});
