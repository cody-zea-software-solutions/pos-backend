import { Test, TestingModule } from '@nestjs/testing';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

describe('ShopController', () => {
  let controller: ShopController;
  let service: ShopService;

  const mockShopService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopController],
      providers: [{ provide: ShopService, useValue: mockShopService }],
    }).compile();

    controller = module.get<ShopController>(ShopController);
    service = module.get<ShopService>(ShopService);
  });

  it('should call service.create with dto', async () => {
    const dto: CreateShopDto = {
      business_id: 1,
      shop_name: 'Shop',
      shop_code: 'S1',
      default_gst_treatment: 'TAXABLE',
    };
    mockShopService.create.mockResolvedValue({ shop_id: 1, ...dto });

    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result.shop_id).toBe(1);
  });

  it('should return all shops', async () => {
    const shops = [{ shop_id: 1 }];
    mockShopService.findAll.mockResolvedValue(shops);

    const result = await controller.findAll();
    expect(result).toEqual(shops);
  });

  it('should return one shop', async () => {
    const shop = { shop_id: 1 };
    mockShopService.findOne.mockResolvedValue(shop);

    const result = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(shop);
  });

  it('should update a shop', async () => {
    const dto: UpdateShopDto = { shop_name: 'Updated' };
    const updated = { shop_id: 1, shop_name: 'Updated' };
    mockShopService.update.mockResolvedValue(updated);

    const result = await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(updated);
  });

  it('should remove a shop', async () => {
    const removed = { shop_id: 1 };
    mockShopService.remove.mockResolvedValue(removed);

    const result = await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(removed);
  });
});
