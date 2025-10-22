import { PartialType } from '@nestjs/mapped-types';
import { CreateGstRateDto } from './create-gst-rates.dto';

export class UpdateGstRateDto extends PartialType(CreateGstRateDto) {}
