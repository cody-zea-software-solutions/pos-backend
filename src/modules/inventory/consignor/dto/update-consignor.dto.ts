import { PartialType } from '@nestjs/mapped-types';
import { CreateConsignorDto } from './create-consignor.dto';

export class UpdateConsignorDto extends PartialType(CreateConsignorDto) {}