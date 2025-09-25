import { Test, TestingModule } from '@nestjs/testing';
import { RefundItemsController } from './refund-items.controller';

describe('RefundItemsController', () => {
  let controller: RefundItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefundItemsController],
    }).compile();

    controller = module.get<RefundItemsController>(RefundItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
