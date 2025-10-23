import { PartialType } from '@nestjs/mapped-types';
import { CreateGstItemDetailDto } from './create-gst-item.dto';

export class UpdateGstItemDetailDto extends PartialType(CreateGstItemDetailDto) {}
