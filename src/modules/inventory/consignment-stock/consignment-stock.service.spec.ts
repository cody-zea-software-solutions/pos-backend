import { Test, TestingModule } from '@nestjs/testing';
import { ConsignmentStockService } from './consignment-stock.service';

describe('ConsignmentStockService', () => {
  let service: ConsignmentStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsignmentStockService],
    }).compile();

    service = module.get<ConsignmentStockService>(ConsignmentStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
