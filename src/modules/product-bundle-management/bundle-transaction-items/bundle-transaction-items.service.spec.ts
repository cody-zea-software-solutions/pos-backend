import { Test, TestingModule } from '@nestjs/testing';
import { BundleTransactionItemsService } from './bundle-transaction-items.service';

describe('BundleTransactionItemsService', () => {
  let service: BundleTransactionItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BundleTransactionItemsService],
    }).compile();

    service = module.get<BundleTransactionItemsService>(BundleTransactionItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
