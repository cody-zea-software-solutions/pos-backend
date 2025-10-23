import { Module } from '@nestjs/common';
import { ConsignmentSettlementsService } from './consignment-settlements.service';
import { ConsignmentSettlementsController } from './consignment-settlements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsignmentSettlement } from './consignment-settlement.entity';
import { ConsignorModule } from '../consignor/consignor.module';
import { ShopModule } from 'src/modules/shop/shop.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ConsignmentSettlement]),
  ConsignorModule,
  ShopModule,
  UsersModule,
],
  providers: [ConsignmentSettlementsService],
  controllers: [ConsignmentSettlementsController],
  exports: [ConsignmentSettlementsService],
})
export class ConsignmentSettlementsModule {}
