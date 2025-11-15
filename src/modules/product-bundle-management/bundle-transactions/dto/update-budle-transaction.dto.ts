import { PartialType } from '@nestjs/mapped-types';
import { CreateBundleTransactionDto } from './create-bundle-transaction.dto';

export class UpdateBundleTransactionDto extends PartialType(CreateBundleTransactionDto) {}
