import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsDateString, IsDate } from 'class-validator';

export class StockReportFilterDto {
  @IsInt()
  shop_id: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_date?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_date?: string;
}