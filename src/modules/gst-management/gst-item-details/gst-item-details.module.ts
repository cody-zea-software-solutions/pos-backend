import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GstItemDetail } from './gst-item-details.entity';
import { GstItemDetailsService } from './gst-item-details.service';
import { GstItemDetailsController } from './gst-item-details.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GstItemDetail])],
  controllers: [GstItemDetailsController],
  providers: [GstItemDetailsService],
  exports: [GstItemDetailsService],
})
export class GstItemDetailsModule {}
