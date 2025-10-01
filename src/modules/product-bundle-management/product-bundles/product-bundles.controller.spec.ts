import { Test, TestingModule } from '@nestjs/testing';
import { ProductBundlesController } from './product-bundles.controller';

describe('ProductBundlesController', () => {
  let controller: ProductBundlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductBundlesController],
    }).compile();

    controller = module.get<ProductBundlesController>(ProductBundlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
