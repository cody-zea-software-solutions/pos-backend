import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  // Only required for cashiers — optional here, validated in service
  @IsOptional()
  @IsString()
  counter_code?: string;
}