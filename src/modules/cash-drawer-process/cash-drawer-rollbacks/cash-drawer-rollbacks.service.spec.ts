import { Test, TestingModule } from '@nestjs/testing';
import { CashDrawerRollbacksService } from './cash-drawer-rollbacks.service';

describe('CashDrawerRollbacksService', () => {
  let service: CashDrawerRollbacksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashDrawerRollbacksService],
    }).compile();

    service = module.get<CashDrawerRollbacksService>(CashDrawerRollbacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
