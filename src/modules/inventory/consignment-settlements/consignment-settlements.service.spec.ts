import { Test, TestingModule } from '@nestjs/testing';
import { ConsignmentSettlementsService } from './consignment-settlements.service';

describe('ConsignmentSettlementsService', () => {
  let service: ConsignmentSettlementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsignmentSettlementsService],
    }).compile();

    service = module.get<ConsignmentSettlementsService>(ConsignmentSettlementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
