import { Test, TestingModule } from '@nestjs/testing';
import { CashDrawerLogsService } from './cash-drawer-logs.service';

describe('CashDrawerLogsService', () => {
  let service: CashDrawerLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashDrawerLogsService],
    }).compile();

    service = module.get<CashDrawerLogsService>(CashDrawerLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
