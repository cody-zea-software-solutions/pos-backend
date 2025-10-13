import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { ProductSubcategoryModule } from '../product-subcategory/product-subcategory.module';
import { ProductGroupModule } from '../product-group/product-group.module';
import { ConsignorModule } from '../../inventory/consignor/consignor.module';
import { ProductUnitsModule } from '../product-units/product-units.module';
import { SubscriptionPlanModule } from '../../subscription-plan/subscription-plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ProductCategoryModule,
    ProductSubcategoryModule,
    ProductGroupModule,
    ConsignorModule, 
    ProductUnitsModule,  
    SubscriptionPlanModule,    
],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
