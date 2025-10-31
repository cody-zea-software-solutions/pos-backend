import { Test, TestingModule } from '@nestjs/testing';
import { ShopInventoryController } from './shop-inventory.controller';
import { ShopInventoryService } from './shop-inventory.service';

describe('ShopInventoryController', () => {
  let controller: ShopInventoryController;
  let service: ShopInventoryService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopInventoryController],
      providers: [{ provide: ShopInventoryService, useValue: mockService }],
    }).compile();

    controller = module.get<ShopInventoryController>(ShopInventoryController);
    service = module.get<ShopInventoryService>(ShopInventoryService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create on create()', async () => {
    const dto = { shop_id: 1, product_id: 1 };
    const result = { inventory_id: 1 };
    mockService.create.mockResolvedValue(result);

    expect(await controller.create(dto as any)).toEqual(result);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should return all inventories on findAll()', async () => {
    const result = [{ id: 1 }];
    mockService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toEqual(result);
  });

  it('should return one inventory on findOne()', async () => {
    const result = { id: 1 };
    mockService.findOne.mockResolvedValue(result);

    expect(await controller.findOne(1)).toEqual(result);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('should update inventory on update()', async () => {
    const dto = { available_quantity: 10 };
    const result = { id: 1, ...dto };
    mockService.update.mockResolvedValue(result);

    expect(await controller.update(1, dto as any)).toEqual(result);
    expect(mockService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove inventory on remove()', async () => {
    mockService.remove.mockResolvedValue(undefined);
    expect(await controller.remove(1)).toBeUndefined();
    expect(mockService.remove).toHaveBeenCalledWith(1);
  });
});
