import { Module } from '@nestjs/common';
import { GrnItemsService } from './grn-items.service';
import { GrnItemsController } from './grn-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GRNItem } from './grn-item.entity';
import { ProductModule } from '../../product-management/product/product.module';
import { GoodsReceivedNotesModule } from '../goods-received-notes/goods-received-notes.module';
import { ProductVariationModule } from '../../product-management/product-variation/product-variation.module';

@Module({
  imports: [TypeOrmModule.forFeature([GRNItem]), ProductModule, GoodsReceivedNotesModule, ProductVariationModule],
  providers: [GrnItemsService],
  controllers: [GrnItemsController],
  exports: [GrnItemsService],
})
export class GrnItemsModule {}
