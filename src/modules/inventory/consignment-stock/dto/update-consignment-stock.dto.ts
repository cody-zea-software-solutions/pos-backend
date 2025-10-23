import { PartialType } from '@nestjs/mapped-types';
import { CreateConsignmentStockDto } from './create-consignment-stock.dto';

export class UpdateConsignmentStockDto extends PartialType(CreateConsignmentStockDto) {}