import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariationService } from './product-variation.service';

describe('ProductVariationService', () => {
  let service: ProductVariationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariationService],
    }).compile();

    service = module.get<ProductVariationService>(ProductVariationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
