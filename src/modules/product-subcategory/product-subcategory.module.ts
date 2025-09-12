import { Module } from '@nestjs/common';
import { ProductSubcategoryController } from './product-subcategory.controller';
import { ProductSubcategoryService } from './product-subcategory.service';

@Module({
  controllers: [ProductSubcategoryController],
  providers: [ProductSubcategoryService]
})
export class ProductSubcategoryModule {}
