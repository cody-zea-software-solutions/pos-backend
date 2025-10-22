import { Test, TestingModule } from '@nestjs/testing';
import { GstTransactionsController } from './gst-transactions.controller';

describe('GstTransactionsController', () => {
  let controller: GstTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GstTransactionsController],
    }).compile();

    controller = module.get<GstTransactionsController>(GstTransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
