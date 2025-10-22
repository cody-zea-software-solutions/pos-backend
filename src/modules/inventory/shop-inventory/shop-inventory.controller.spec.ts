import { Test, TestingModule } from '@nestjs/testing';
import { ShopInventoryController } from './shop-inventory.controller';

describe('ShopInventoryController', () => {
  let controller: ShopInventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopInventoryController],
    }).compile();

    controller = module.get<ShopInventoryController>(ShopInventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
