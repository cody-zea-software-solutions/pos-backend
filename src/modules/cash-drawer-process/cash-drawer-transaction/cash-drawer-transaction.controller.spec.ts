import { Test, TestingModule } from '@nestjs/testing';
import { CashDrawerTransactionController } from './cash-drawer-transaction.controller';

describe('CashDrawerTransactionController', () => {
  let controller: CashDrawerTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashDrawerTransactionController],
    }).compile();

    controller = module.get<CashDrawerTransactionController>(CashDrawerTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
