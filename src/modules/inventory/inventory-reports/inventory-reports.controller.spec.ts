import { Test, TestingModule } from '@nestjs/testing';
import { InventoryReportsController } from './inventory-reports.controller';

describe('InventoryReportsController', () => {
  let controller: InventoryReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryReportsController],
    }).compile();

    controller = module.get<InventoryReportsController>(InventoryReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
