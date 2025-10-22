import { Test, TestingModule } from '@nestjs/testing';
import { GstItemController } from './gst-item.controller';

describe('GstItemController', () => {
  let controller: GstItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GstItemController],
    }).compile();

    controller = module.get<GstItemController>(GstItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
