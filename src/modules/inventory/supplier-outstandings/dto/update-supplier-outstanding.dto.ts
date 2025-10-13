import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierOutstandingDto } from './create-supplier-outstanding.dto';

export class UpdateSupplierOutstandingDto extends PartialType(CreateSupplierOutstandingDto) {}