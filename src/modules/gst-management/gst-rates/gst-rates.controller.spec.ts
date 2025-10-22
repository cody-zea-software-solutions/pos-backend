import { Test, TestingModule } from '@nestjs/testing';
import { GstRatesController } from './gst-rates.controller';

describe('GstRatesController', () => {
  let controller: GstRatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GstRatesController],
    }).compile();

    controller = module.get<GstRatesController>(GstRatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
