import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsDateString, IsDate } from 'class-validator';

export class CreateGiftCardDto {
  @IsNotEmpty()
  card_number: string;

  @IsNumber()
  initial_value: number;

  @IsNumber()
  current_balance: number;

  @IsDate()
  @Type(() => Date)
  issue_date: Date;

  @IsDate()
  @Type(() => Date)
  expiry_date: Date;

  @IsOptional()
  issued_to_customer?: number;

  @IsOptional()
  issued_by_user?: number;

  @IsOptional()
  status?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  last_used?: Date;
}