import { Test, TestingModule } from '@nestjs/testing';
import { RefundItemsController } from './refund-items.controller';
import { RefundItemsService } from './refund-items.service';
import { CreateRefundItemDto } from './dto/create-refund-item.dto';

describe('RefundItemsController', () => {
  let controller: RefundItemsController;
  let service: RefundItemsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefundItemsController],
      providers: [{ provide: RefundItemsService, useValue: mockService }],
    }).compile();

    controller = module.get<RefundItemsController>(RefundItemsController);
    service = module.get<RefundItemsService>(RefundItemsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateRefundItemDto = {
        refund_id: 1,
        quantity_refunded: 2,
        unit_price: 50,
        refund_amount: 100,
        condition: 'NEW' as any,
        restock_action: 'RESTOCK' as any,
      };

      const mockResult = { refund_item_id: 1, ...dto };
      mockService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);
      expect(result).toEqual(mockResult);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all refund items', async () => {
      const mockItems = [{ refund_item_id: 1 }];
      mockService.findAll.mockResolvedValue(mockItems);

      const result = await controller.findAll();
      expect(result).toEqual(mockItems);
    });
  });

  describe('findOne', () => {
    it('should return one refund item', async () => {
      const mockItem = { refund_item_id: 1 };
      mockService.findOne.mockResolvedValue(mockItem);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockItem);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });
  });
});
