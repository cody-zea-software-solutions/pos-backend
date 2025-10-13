import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  const mockPaymentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{ provide: PaymentsService, useValue: mockPaymentsService }],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto = { transaction_id: 1, payment_method: 'CASH', amount: 50 };
      const result = { payment_id: 1, ...dto };
      mockPaymentsService.create.mockResolvedValue(result);

      expect(await controller.create(dto as any)).toEqual(result);
      expect(mockPaymentsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      const result = [{ payment_id: 1 }];
      mockPaymentsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockPaymentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single payment', async () => {
      const result = { payment_id: 1 };
      mockPaymentsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockPaymentsService.findOne).toHaveBeenCalledWith(1);
    });
  });
});
