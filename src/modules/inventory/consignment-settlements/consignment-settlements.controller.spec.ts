import { Test, TestingModule } from '@nestjs/testing';
import { ConsignmentSettlementsController } from './consignment-settlements.controller';

describe('ConsignmentSettlementsController', () => {
  let controller: ConsignmentSettlementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsignmentSettlementsController],
    }).compile();

    controller = module.get<ConsignmentSettlementsController>(ConsignmentSettlementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
