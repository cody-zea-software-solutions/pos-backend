import { Test, TestingModule } from '@nestjs/testing';
import { BatchMovementsController } from './batch-movements.controller';

describe('BatchMovementsController', () => {
  let controller: BatchMovementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchMovementsController],
    }).compile();

    controller = module.get<BatchMovementsController>(BatchMovementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
