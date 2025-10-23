import { Test, TestingModule } from '@nestjs/testing';
import { GstReturnService } from './gst-return.service';

describe('GstReturnService', () => {
  let service: GstReturnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GstReturnService],
    }).compile();

    service = module.get<GstReturnService>(GstReturnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
