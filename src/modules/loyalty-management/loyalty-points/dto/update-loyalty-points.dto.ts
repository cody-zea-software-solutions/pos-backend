import { PartialType } from '@nestjs/mapped-types';
import { CreateLoyaltyPointsDto } from './create-loyalty-points.dto';

export class UpdateLoyaltyPointsDto extends PartialType(CreateLoyaltyPointsDto) {}
