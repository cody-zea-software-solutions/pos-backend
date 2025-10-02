import { PartialType } from '@nestjs/mapped-types';
import { CreateBundleItemDto } from './create-bundle-item.dto';

export class UpdateBundleItemDto extends PartialType(CreateBundleItemDto) {}