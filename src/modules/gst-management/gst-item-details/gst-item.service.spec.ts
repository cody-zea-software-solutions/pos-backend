import { Test, TestingModule } from '@nestjs/testing';
import { GstItemService } from './gst-item-details/gst-item.service';

describe('GstItemService', () => {
  let service: GstItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GstItemService],
    }).compile();

    service = module.get<GstItemService>(GstItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
