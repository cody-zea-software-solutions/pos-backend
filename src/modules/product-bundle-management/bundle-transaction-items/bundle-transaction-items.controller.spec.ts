import { Test, TestingModule } from '@nestjs/testing';
import { BundleTransactionItemsController } from './bundle-transaction-items.controller';

describe('BundleTransactionItemsController', () => {
  let controller: BundleTransactionItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BundleTransactionItemsController],
    }).compile();

    controller = module.get<BundleTransactionItemsController>(BundleTransactionItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
