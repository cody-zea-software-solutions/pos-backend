import { Test, TestingModule } from '@nestjs/testing';
import { ShopInventoryController } from './shop-inventory.controller';
import { ShopInventoryService } from './shop-inventory.service';
import { CreateShopInventoryDto } from './dto/create-shop-inventory.dto';
import { UpdateShopInventoryDto } from './dto/update-shop-inventory.dto';

describe('ShopInventoryController', () => {
  let controller: ShopInventoryController;
  let service: ShopInventoryService;

  const mockShopInventoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopInventoryController],
      providers: [
        {
          provide: ShopInventoryService,
          useValue: mockShopInventoryService,
        },
      ],
    }).compile();

    controller = module.get<ShopInventoryController>(ShopInventoryController);
    service = module.get<ShopInventoryService>(ShopInventoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct data', async () => {
      const dto: CreateShopInventoryDto = {
        shop_id: 1,
        product_id: 2,
        available_quantity: 10,
      } as CreateShopInventoryDto;
      const result = { id: 1, ...dto };

      mockShopInventoryService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockShopInventoryService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all inventories', async () => {
      const result = [{ inventory_id: 1 }];
      mockShopInventoryService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single inventory', async () => {
      const result = { inventory_id: 1 };
      mockShopInventoryService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
      expect(mockShopInventoryService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update inventory', async () => {
      const dto: UpdateShopInventoryDto = { available_quantity: 20 };
      const result = { inventory_id: 1, ...dto };

      mockShopInventoryService.update.mockResolvedValue(result);

      expect(await controller.update(1, dto)).toEqual(result);
      expect(mockShopInventoryService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete an inventory', async () => {
      mockShopInventoryService.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(mockShopInventoryService.remove).toHaveBeenCalledWith(1);
    });
  });
});
