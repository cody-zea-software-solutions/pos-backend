import { Test, TestingModule } from '@nestjs/testing';
import { RefundApprovalsController } from './refund-approvals.controller';
import { RefundApprovalsService } from './refund-approvals.service';
import { CreateRefundApprovalDto } from './dto/create-refund-approval.dto';

describe('RefundApprovalsController', () => {
  let controller: RefundApprovalsController;
  let service: RefundApprovalsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefundApprovalsController],
      providers: [{ provide: RefundApprovalsService, useValue: mockService }],
    }).compile();

    controller = module.get<RefundApprovalsController>(RefundApprovalsController);
    service = module.get<RefundApprovalsService>(RefundApprovalsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateRefundApprovalDto = {
        refund_id: 1,
        approver_user_id: 5,
        approval_status: 'APPROVED' as any,
        approval_level: 'MANAGER' as any,
      };

      const mockResult = { approval_id: 1, ...dto };
      mockService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);
      expect(result).toEqual(mockResult);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all approvals', async () => {
      const mockApprovals = [{ approval_id: 1 }];
      mockService.findAll.mockResolvedValue(mockApprovals);

      const result = await controller.findAll();
      expect(result).toEqual(mockApprovals);
    });
  });

  describe('findOne', () => {
    it('should return one approval', async () => {
      const mockApproval = { approval_id: 1 };
      mockService.findOne.mockResolvedValue(mockApproval);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockApproval);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });
  });
});
