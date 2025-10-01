import { Module } from '@nestjs/common';
import { ProductBundlesService } from './product-bundles.service';
import { ProductBundlesController } from './product-bundles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBundle } from './product-bundle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductBundle])],
  providers: [ProductBundlesService],
  controllers: [ProductBundlesController],
  exports: [ProductBundlesService],
})
export class ProductBundlesModule {}
