import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDecimal,
  MinLength,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../user-role.enum';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(UserRole, { message: 'role must be SUPER_ADMIN, SHOP_ADMIN or CASHIER'})
  role: UserRole;

  @IsOptional()
  @IsNumber()
  assigned_shop_id?: number;

  @IsOptional()
  @IsString()
  permissions?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  can_approve_refunds?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces:2 })
  @Transform(({ value }) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'string') return parseFloat(value);
    return value;
  })
  refund_approval_limit?: number;

  @IsOptional()
  @IsBoolean()
  can_rollback_cash?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces:2 })
  @Transform(({ value }) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'string') return parseFloat(value);
    return value;
  })
  rollback_limit?: number;

  @IsOptional()
  @IsBoolean()
  can_manage_pricing?: boolean;

  @IsOptional()
  @IsBoolean()
  can_manage_gst?: boolean;

  @IsOptional()
  @IsBoolean()
  can_create_batches?: boolean;
}