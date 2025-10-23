import { PartialType } from '@nestjs/mapped-types';
import { CreateConsignmentSettlementDto } from './create-consignment-settlement.dto';

export class UpdateConsignmentSettlementDto extends PartialType(CreateConsignmentSettlementDto) {}