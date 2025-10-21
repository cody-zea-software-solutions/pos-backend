import { PartialType } from '@nestjs/mapped-types';
import { CreateGrnItemDto } from './create-grn-item.dto';

export class UpdateGrnItemDto extends PartialType(CreateGrnItemDto) {}