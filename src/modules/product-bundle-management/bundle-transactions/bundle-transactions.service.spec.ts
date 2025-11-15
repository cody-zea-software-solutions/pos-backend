import { Test, TestingModule } from '@nestjs/testing';
import { BundleTransactionService } from './bundle-transactions.service';

describe('BundleTransactionsService', () => {
  let service: BundleTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BundleTransactionService],
    }).compile();

    service = module.get<BundleTransactionService>(BundleTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
