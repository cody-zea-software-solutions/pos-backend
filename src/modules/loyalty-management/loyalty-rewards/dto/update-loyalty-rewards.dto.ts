import { PartialType } from '@nestjs/mapped-types';
import { CreateLoyaltyRewardsDto } from './create-loyalty-rewards.dto';

export class UpdateLoyaltyRewardsDto extends PartialType(CreateLoyaltyRewardsDto) {}
