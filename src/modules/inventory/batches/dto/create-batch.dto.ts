import { Type } from 'class-transformer';
import {
    IsString,
    IsInt,
    IsDateString,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsDate,
} from 'class-validator';

export class CreateBatchDto {
    @IsString()
    batch_number: string;

    @IsInt()
    product_id: number;

    @IsOptional()
    @IsInt()
    variation_id?: number;

    @IsOptional()
    @IsInt()
    supplier_id?: number;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    manufacture_date?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    expiry_date?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    received_date?: Date;

    @IsInt()
    initial_quantity: number;

    @IsOptional()
    @IsInt()
    current_quantity?: number;

    @IsNumber()
    cost_price_per_unit: number;

    @IsNumber()
    selling_price_per_unit: number;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    quality_status?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsBoolean()
    is_consignment?: boolean;

    @IsOptional()
    @IsInt()
    consignor_id?: number;

    @IsInt()
    created_by_user: number;
}