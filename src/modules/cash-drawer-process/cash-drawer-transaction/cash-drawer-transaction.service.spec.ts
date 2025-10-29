import { Test, TestingModule } from '@nestjs/testing';
import { CashDrawerTransactionService } from './cash-drawer-transaction.service';

describe('CashDrawerTransactionService', () => {
  let service: CashDrawerTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashDrawerTransactionService],
    }).compile();

    service = module.get<CashDrawerTransactionService>(CashDrawerTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
