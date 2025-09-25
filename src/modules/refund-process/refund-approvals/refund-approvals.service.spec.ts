import { Test, TestingModule } from '@nestjs/testing';
import { RefundApprovalsService } from './refund-approvals.service';

describe('RefundApprovalsService', () => {
  let service: RefundApprovalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefundApprovalsService],
    }).compile();

    service = module.get<RefundApprovalsService>(RefundApprovalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
