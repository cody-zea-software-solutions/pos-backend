import { Test, TestingModule } from '@nestjs/testing';
import { RefundItemsService } from './refund-items.service';

describe('RefundItemsService', () => {
  let service: RefundItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefundItemsService],
    }).compile();

    service = module.get<RefundItemsService>(RefundItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
