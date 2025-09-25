import { Test, TestingModule } from '@nestjs/testing';
import { RefundApprovalsController } from './refund-approvals.controller';

describe('RefundApprovalsController', () => {
  let controller: RefundApprovalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefundApprovalsController],
    }).compile();

    controller = module.get<RefundApprovalsController>(RefundApprovalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
