import { Test, TestingModule } from '@nestjs/testing';
import { ConsignmentStockController } from './consignment-stock.controller';
import { ConsignmentStockService } from './consignment-stock.service';

describe('ConsignmentStockController', () => {
  let controller: ConsignmentStockController;
  let service: ConsignmentStockService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsignmentStockController],
      providers: [{ provide: ConsignmentStockService, useValue: mockService }],
    }).compile();

    controller = module.get<ConsignmentStockController>(ConsignmentStockController);
    service = module.get<ConsignmentStockService>(ConsignmentStockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a consignment', async () => {
    const dto = { product_id: 1 };
    mockService.create.mockResolvedValue({ consignment_id: 1, ...dto });
    const result = await controller.create(dto as any);
    expect(result.consignment_id).toBe(1);
  });

  it('should return all consignments', async () => {
    mockService.findAll.mockResolvedValue([{ consignment_id: 1 }]);
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
  });

  it('should return one consignment', async () => {
    mockService.findOne.mockResolvedValue({ consignment_id: 1 });
    const result = await controller.findOne(1);
    expect(result.consignment_id).toBe(1);
  });

  it('should update a consignment', async () => {
    const dto = { quantity_sold: 5 };
    mockService.update.mockResolvedValue({ consignment_id: 1, ...dto });
    const result = await controller.update(1, dto as any);
    expect(result.quantity_sold).toBe(5);
  });

  it('should delete a consignment', async () => {
    mockService.remove.mockResolvedValue(undefined);
    const result = await controller.remove(1);
    expect(result.message).toContain('deleted successfully');
  });
});
