import { Test, TestingModule } from '@nestjs/testing';
import { GrnItemsService } from './grn-items.service';

describe('GrnItemsService', () => {
  let service: GrnItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrnItemsService],
    }).compile();

    service = module.get<GrnItemsService>(GrnItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
