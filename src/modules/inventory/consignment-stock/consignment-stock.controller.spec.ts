import { Test, TestingModule } from '@nestjs/testing';
import { ConsignmentStockController } from './consignment-stock.controller';

describe('ConsignmentStockController', () => {
  let controller: ConsignmentStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsignmentStockController],
    }).compile();

    controller = module.get<ConsignmentStockController>(ConsignmentStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
