import { PartialType } from '@nestjs/mapped-types';
import { CreateLoyaltyLevelsDto } from './create-loyalty-levels.dto';

export class UpdateLoyaltyLevelsDto extends PartialType(CreateLoyaltyLevelsDto) {}
