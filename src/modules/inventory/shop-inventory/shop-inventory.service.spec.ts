import { Test, TestingModule } from '@nestjs/testing';
import { ShopInventoryService } from './shop-inventory.service';

describe('ShopInventoryService', () => {
  let service: ShopInventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopInventoryService],
    }).compile();

    service = module.get<ShopInventoryService>(ShopInventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
