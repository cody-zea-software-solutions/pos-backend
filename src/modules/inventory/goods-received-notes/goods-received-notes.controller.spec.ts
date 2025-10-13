import { Test, TestingModule } from '@nestjs/testing';
import { GoodsReceivedNotesController } from './goods-received-notes.controller';

describe('GoodsReceivedNotesController', () => {
  let controller: GoodsReceivedNotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsReceivedNotesController],
    }).compile();

    controller = module.get<GoodsReceivedNotesController>(GoodsReceivedNotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
