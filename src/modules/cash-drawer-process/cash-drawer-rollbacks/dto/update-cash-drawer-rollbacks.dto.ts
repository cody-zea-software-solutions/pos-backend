import { PartialType } from '@nestjs/mapped-types';
import { CreateCashDrawerRollbackDto } from './create-cash-drawer-rollbacks.dto';

export class UpdateCashDrawerRollbackDto extends PartialType(CreateCashDrawerRollbackDto) {}
