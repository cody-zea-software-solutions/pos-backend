import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariationController } from './product-variation.controller';

describe('ProductVariationController', () => {
  let controller: ProductVariationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariationController],
    }).compile();

    controller = module.get<ProductVariationController>(ProductVariationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
