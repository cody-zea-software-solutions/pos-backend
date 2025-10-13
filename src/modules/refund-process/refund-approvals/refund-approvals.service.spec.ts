import { Test, TestingModule } from '@nestjs/testing';
import { RefundApprovalsService } from './refund-approvals.service';
import { RefundApproval } from './refund-approval.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefundService } from '../refund/refund.service';
import { UsersService } from '../../users/users.service';
import { NotFoundException } from '@nestjs/common';

const mockApproval: Partial<RefundApproval> = {
  approval_id: 1,
  approval_status: 'APPROVED' as any,
  approval_level: 'MANAGER' as any,
};

describe('RefundApprovalsService', () => {
  let service: RefundApprovalsService;
  let repo: Repository<RefundApproval>;

  const mockApprovalRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockRefundService = { findOne: jest.fn() };
  const mockUserService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefundApprovalsService,
        { provide: getRepositoryToken(RefundApproval), useValue: mockApprovalRepo },
        { provide: RefundService, useValue: mockRefundService },
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<RefundApprovalsService>(RefundApprovalsService);
    repo = module.get<Repository<RefundApproval>>(getRepositoryToken(RefundApproval));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw NotFoundException if refund not found', async () => {
      mockRefundService.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          refund_id: 99,
          approval_status: 'APPROVED' as any,
          approval_level: 'MANAGER' as any,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create and save approval successfully (with approver)', async () => {
      mockRefundService.findOne.mockResolvedValue({ refund_id: 1 });
      mockUserService.findOne.mockResolvedValue({ id: 10 });
      mockApprovalRepo.create.mockReturnValue(mockApproval);
      mockApprovalRepo.save.mockResolvedValue(mockApproval);

      const dto = {
        refund_id: 1,
        approver_user_id: 10,
        approval_status: 'APPROVED' as any,
        approval_level: 'MANAGER' as any,
      };

      const result = await service.create(dto);

      expect(result).toEqual(mockApproval);
      expect(mockApprovalRepo.save).toHaveBeenCalled();
    });

    it('should create and save approval successfully (without approver)', async () => {
      mockRefundService.findOne.mockResolvedValue({ refund_id: 1 });
      mockUserService.findOne.mockResolvedValue(null);
      mockApprovalRepo.create.mockReturnValue(mockApproval);
      mockApprovalRepo.save.mockResolvedValue(mockApproval);

      const dto = {
        refund_id: 1,
        approval_status: 'APPROVED' as any,
        approval_level: 'SUPERVISOR' as any,
      };

      const result = await service.create(dto);

      expect(result).toEqual(mockApproval);
      expect(mockApprovalRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all approvals', async () => {
      mockApprovalRepo.find.mockResolvedValue([mockApproval]);

      const result = await service.findAll();
      expect(result).toEqual([mockApproval]);
    });
  });

  describe('findOne', () => {
    it('should return approval if found', async () => {
      mockApprovalRepo.findOne.mockResolvedValue(mockApproval);

      const result = await service.findOne(1);
      expect(result).toEqual(mockApproval);
    });

    it('should throw NotFoundException if approval not found', async () => {
      mockApprovalRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
