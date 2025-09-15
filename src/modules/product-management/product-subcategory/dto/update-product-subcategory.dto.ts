import { PartialType } from '@nestjs/mapped-types';
import { CreateProductSubcategoryDto } from './create-product-subcategory.dto';


export class UpdateProductSubcategoryDto extends PartialType(CreateProductSubcategoryDto) {}