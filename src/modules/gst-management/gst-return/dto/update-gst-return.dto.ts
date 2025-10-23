import { PartialType } from '@nestjs/mapped-types';
import { CreateGstReturnDto } from './create-gst-return.dto';

export class UpdateGstReturnDto extends PartialType(CreateGstReturnDto) {}
