import { Test, TestingModule } from '@nestjs/testing';
import { GstRatesService } from './gst-rates.service';

describe('GstRatesService', () => {
  let service: GstRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GstRatesService],
    }).compile();

    service = module.get<GstRatesService>(GstRatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
