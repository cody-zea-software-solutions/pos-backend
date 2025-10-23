import { Test, TestingModule } from '@nestjs/testing';
import { GstReturnController } from './gst-return.controller';

describe('GstReturnController', () => {
  let controller: GstReturnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GstReturnController],
    }).compile();

    controller = module.get<GstReturnController>(GstReturnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
