import { Test, TestingModule } from '@nestjs/testing';
import { BundleItemsService } from './bundle-items.service';

describe('BundleItemsService', () => {
  let service: BundleItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BundleItemsService],
    }).compile();

    service = module.get<BundleItemsService>(BundleItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
