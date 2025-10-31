import { PartialType } from '@nestjs/mapped-types';
import { CreateCashDrawerLogsDto } from './create-cash-drawer-logs.dto';

export class UpdateCashDrawerLogsDto extends PartialType(CreateCashDrawerLogsDto) {}
