import { Test, TestingModule } from '@nestjs/testing';
import { BundleItemsController } from './bundle-items.controller';
import { BundleItemsService } from './bundle-items.service';
import { CreateBundleItemDto } from './dto/create-bundle-item.dto';
import { UpdateBundleItemDto } from './dto/update-bundle-item.dto';
import { BundleItemType } from './bundle-item.entity';

describe('BundleItemsController', () => {
  let controller: BundleItemsController;
  let service: BundleItemsService;

  const mockBundleItem = {
    bundle_item_id: 1,
    item_type: BundleItemType.PRODUCT,
    quantity: 2,
  };

  const mockBundleItemsService = {
    create: jest.fn().mockResolvedValue(mockBundleItem),
    findAll: jest.fn().mockResolvedValue([mockBundleItem]),
    findOne: jest.fn().mockResolvedValue(mockBundleItem),
    update: jest.fn().mockResolvedValue({ ...mockBundleItem, quantity: 3 }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BundleItemsController],
      providers: [
        {
          provide: BundleItemsService,
          useValue: mockBundleItemsService,
        },
      ],
    }).compile();

    controller = module.get<BundleItemsController>(BundleItemsController);
    service = module.get<BundleItemsService>(BundleItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a bundle item', async () => {
    const dto: CreateBundleItemDto = {
      bundle_id: 1,
      item_type: BundleItemType.PRODUCT,
      quantity: 2,
    };

    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockBundleItem);
  });

  it('should return all bundle items', async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockBundleItem]);
  });

  it('should return a single bundle item', async () => {
    const result = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockBundleItem);
  });

  it('should update a bundle item', async () => {
    const dto: UpdateBundleItemDto = { quantity: 3 };
    const result = await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual({ ...mockBundleItem, quantity: 3 });
  });

  it('should remove a bundle item', async () => {
    const result = await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toBeUndefined();
  });
});
