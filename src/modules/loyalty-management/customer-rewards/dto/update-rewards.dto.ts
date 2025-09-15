import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerRewardsDto } from './create-rewards.dto';

export class UpdateCustomerRewardsDto extends PartialType(CreateCustomerRewardsDto) {}
