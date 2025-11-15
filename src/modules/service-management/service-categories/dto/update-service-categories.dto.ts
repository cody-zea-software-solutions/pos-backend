import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceCategoryDto } from './create-service-categories.dto';

export class UpdateServiceCategoryDto extends PartialType(CreateServiceCategoryDto) {}
