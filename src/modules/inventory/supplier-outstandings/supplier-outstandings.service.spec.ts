import { Test, TestingModule } from '@nestjs/testing';
import { SupplierOutstandingsService } from './supplier-outstandings.service';

describe('SupplierOutstandingsService', () => {
  let service: SupplierOutstandingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplierOutstandingsService],
    }).compile();

    service = module.get<SupplierOutstandingsService>(SupplierOutstandingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
