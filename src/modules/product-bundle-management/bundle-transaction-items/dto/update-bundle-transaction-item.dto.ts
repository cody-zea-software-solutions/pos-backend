import { PartialType } from '@nestjs/mapped-types';
import { CreateBundleTransactionItemsDto } from './create-bundle-transaction-items.dto';

export class UpdateBundleItemDto extends PartialType(CreateBundleTransactionItemsDto) {}