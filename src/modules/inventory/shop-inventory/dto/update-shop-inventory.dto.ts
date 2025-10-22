import { PartialType } from '@nestjs/mapped-types';
import { CreateShopInventoryDto } from './create-shop-inventory.dto';

export class UpdateShopInventoryDto extends PartialType(CreateShopInventoryDto) {}