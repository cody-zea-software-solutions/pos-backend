import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceResourceDto } from './create-service-resources.dto';

export class UpdateServiceResourceDto extends PartialType(CreateServiceResourceDto) {}
