import { PartialType } from '@nestjs/mapped-types';
import { CreateGstTransactionDto } from './create-gst-transaction.dto';

export class UpdateGstTransactionDto extends PartialType(CreateGstTransactionDto) {}
