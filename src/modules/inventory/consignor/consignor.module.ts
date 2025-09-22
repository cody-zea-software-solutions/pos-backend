import { Module } from '@nestjs/common';
import { ConsignorService } from './consignor.service';
import { ConsignorController } from './consignor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consignor } from './consignor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consignor])],
  providers: [ConsignorService],
  controllers: [ConsignorController],
  exports: [ConsignorService],
})
export class ConsignorModule {}
