import { Test, TestingModule } from '@nestjs/testing';
import { GrnItemsController } from './grn-items.controller';

describe('GrnItemsController', () => {
  let controller: GrnItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrnItemsController],
    }).compile();

    controller = module.get<GrnItemsController>(GrnItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
