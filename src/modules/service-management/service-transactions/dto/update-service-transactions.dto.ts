import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceTransactionDto } from './create-service-transactions.dto';

export class UpdateServiceTransactionDto extends PartialType(CreateServiceTransactionDto) {}
