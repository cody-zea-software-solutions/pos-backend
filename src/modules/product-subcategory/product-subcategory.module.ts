import { Module } from '@nestjs/common';
import { ProductSubcategoryController } from './product-subcategory.controller';
import { ProductSubcategoryService } from './product-subcategory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSubcategory } from './product-subcategory.entity';
import { ProductCategoryModule } from '../product-category/product-category.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSubcategory]), ProductCategoryModule],
  controllers: [ProductSubcategoryController],
  providers: [ProductSubcategoryService],
  exports: [ProductSubcategoryService],
})
export class ProductSubcategoryModule {}
