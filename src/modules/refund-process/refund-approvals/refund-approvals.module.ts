import { Module } from '@nestjs/common';
import { RefundApprovalsService } from './refund-approvals.service';
import { RefundApprovalsController } from './refund-approvals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundApproval } from './refund-approval.entity';
import { RefundModule } from '../refund/refund.module';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([RefundApproval]), RefundModule, UsersModule],
  providers: [RefundApprovalsService],
  controllers: [RefundApprovalsController],
  exports: [RefundApprovalsService],
})
export class RefundApprovalsModule {}
