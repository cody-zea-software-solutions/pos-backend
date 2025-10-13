import { Test, TestingModule } from '@nestjs/testing';
import { TransactionItemsController } from './transaction-items.controller';
import { TransactionItemsService } from './transaction-items.service';
import { CreateTransactionItemDto } from './dto/create-transaction-item.dto';

describe('TransactionItemsController', () => {
  let controller: TransactionItemsController;
  let service: TransactionItemsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionItemsController],
      providers: [
        {
          provide: TransactionItemsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TransactionItemsController>(TransactionItemsController);
    service = module.get<TransactionItemsService>(TransactionItemsService);
  });

  afterEach(() => jest.clearAllMocks());

  const mockItem = {
    item_id: 1,
    quantity: 2,
    unit_price: 100,
    line_total: 200,
  };

  describe('create', () => {
    it('should create a new transaction item', async () => {
      const dto: CreateTransactionItemDto = {
        transaction_id: 1,
        product_id: 2,
        variation_id: 3,
        consignor_id: 4,
        quantity: 2,
        unit_price: 100,
        discount_amount: 0,
        line_total: 200,
      };
      mockService.create.mockResolvedValue(mockItem);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockItem);
    });
  });

  describe('findAll', () => {
    it('should return an array of transaction items', async () => {
      mockService.findAll.mockResolvedValue([mockItem]);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockItem]);
    });
  });

  describe('findOne', () => {
    it('should return a single transaction item', async () => {
      mockService.findOne.mockResolvedValue(mockItem);
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockItem);
    });
  });
});
