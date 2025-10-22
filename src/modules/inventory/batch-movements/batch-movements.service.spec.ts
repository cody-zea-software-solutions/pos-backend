import { Test, TestingModule } from '@nestjs/testing';
import { BatchMovementsService } from './batch-movements.service';

describe('BatchMovementsService', () => {
  let service: BatchMovementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchMovementsService],
    }).compile();

    service = module.get<BatchMovementsService>(BatchMovementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
