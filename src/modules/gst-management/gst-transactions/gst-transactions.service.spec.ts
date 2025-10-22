import { Test, TestingModule } from '@nestjs/testing';
import { GstTransactionsService } from './gst-transactions.service';

describe('GstTransactionsService', () => {
  let service: GstTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GstTransactionsService],
    }).compile();

    service = module.get<GstTransactionsService>(GstTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
