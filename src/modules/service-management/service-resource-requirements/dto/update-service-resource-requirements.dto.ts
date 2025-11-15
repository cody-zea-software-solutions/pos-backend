import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceResourceRequirementDto } from './create-service-resource-requirements.dto';

export class UpdateServiceResourceRequirementDto extends PartialType(CreateServiceResourceRequirementDto) {}
