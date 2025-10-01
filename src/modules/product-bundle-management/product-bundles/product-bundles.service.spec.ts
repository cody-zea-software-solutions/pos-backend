import { Test, TestingModule } from '@nestjs/testing';
import { ProductBundlesService } from './product-bundles.service';

describe('ProductBundlesService', () => {
  let service: ProductBundlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductBundlesService],
    }).compile();

    service = module.get<ProductBundlesService>(ProductBundlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
