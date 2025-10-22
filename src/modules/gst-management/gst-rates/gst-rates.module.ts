import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GstRate } from './gst-rates.entity';
import { GstRatesService } from './gst-rates.service';
import { GstRatesController } from './gst-rates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GstRate])],
  controllers: [GstRatesController],
  providers: [GstRatesService],
  exports: [GstRatesService],
})
export class GstRatesModule {}
