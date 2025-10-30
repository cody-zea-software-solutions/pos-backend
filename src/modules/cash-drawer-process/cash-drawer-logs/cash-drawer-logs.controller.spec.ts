import { Test, TestingModule } from '@nestjs/testing';
import { CashDrawerLogsController } from './cash-drawer-logs.controller';

describe('CashDrawerLogsController', () => {
  let controller: CashDrawerLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashDrawerLogsController],
    }).compile();

    controller = module.get<CashDrawerLogsController>(CashDrawerLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
