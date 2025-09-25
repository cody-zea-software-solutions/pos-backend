import { IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApprovalLevel, ApprovalStatus } from '../refund-approval.entity';

export class CreateRefundApprovalDto {
  @IsNumber()
  refund_id: number;

  @IsOptional()
  approver_user_id?: number;

  @IsEnum(ApprovalStatus)
  approval_status: ApprovalStatus;

  @IsOptional()
  approval_notes?: string;

  @IsEnum(ApprovalLevel)
  approval_level: ApprovalLevel;
}