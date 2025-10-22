import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateBatchMovementDto {
  @IsInt()
  batch_id: number;

  @IsOptional()
  @IsInt()
  from_shop_id?: number;

  @IsOptional()
  @IsInt()
  to_shop_id?: number;

  @IsInt()
  quantity_moved: number;

  @IsOptional()
  @IsString()
  movement_type?: string;

  @IsOptional()
  @IsString()
  reference_number?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsInt()
  authorized_by_user: number;
}