import { 
    IsInt, 
    IsOptional, 
    IsNumber, 
    IsBoolean,
    Min,
    IsDateString, 
    IsString 
} from 'class-validator';
export class CreateBundleTransactionDto {

@IsInt()
transaction_id: number;


@IsInt()
bundle_id: number;


@IsInt()
@IsOptional()
quantity: number;


@IsNumber()
@Min(0)
bundle_price: number;


@IsNumber()
total_individual_price: number;


@IsNumber()
savings_amount: number;


@IsOptional()
@IsString()
customization_notes?: string;


@IsOptional()
@IsBoolean()
all_items_delivered?: boolean;


@IsOptional()
delivery_completion_date?: Date;


@IsOptional()
@IsString()
fulfillment_notes?: string;
}