import { Test, TestingModule } from '@nestjs/testing';
import { BundleItemsController } from './bundle-items.controller';

describe('BundleItemsController', () => {
  let controller: BundleItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BundleItemsController],
    }).compile();

    controller = module.get<BundleItemsController>(BundleItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
