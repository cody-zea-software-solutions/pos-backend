import { Module } from '@nestjs/common';
import { BundleItemsService } from './bundle-items.service';
import { BundleItemsController } from './bundle-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BundleItem } from './bundle-item.entity';
import { ProductBundlesModule } from '../product-bundles/product-bundles.module';
import { ProductModule } from '../../product-management/product/product.module';
import { ProductVariationModule } from '../../product-management/product-variation/product-variation.module';
import { ServicesModule } from '../../service-management/services/services.module';

@Module({
  imports: [TypeOrmModule.forFeature([BundleItem]), ProductBundlesModule, ProductModule, ProductVariationModule, ServicesModule],
  providers: [BundleItemsService],
  controllers: [BundleItemsController],
  exports: [BundleItemsService],
})
export class BundleItemsModule {}
