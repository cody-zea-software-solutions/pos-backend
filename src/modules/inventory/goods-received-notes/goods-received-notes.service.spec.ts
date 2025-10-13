import { Test, TestingModule } from '@nestjs/testing';
import { GoodsReceivedNotesService } from './goods-received-notes.service';

describe('GoodsReceivedNotesService', () => {
  let service: GoodsReceivedNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodsReceivedNotesService],
    }).compile();

    service = module.get<GoodsReceivedNotesService>(GoodsReceivedNotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
