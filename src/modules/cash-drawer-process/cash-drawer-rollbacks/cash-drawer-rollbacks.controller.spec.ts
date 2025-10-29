import { Test, TestingModule } from '@nestjs/testing';
import { CashDrawerRollbacksController } from './cash-drawer-rollbacks.controller';

describe('CashDrawerRollbacksController', () => {
  let controller: CashDrawerRollbacksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashDrawerRollbacksController],
    }).compile();

    controller = module.get<CashDrawerRollbacksController>(CashDrawerRollbacksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
