import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GstReturnService } from './gst-return.service';
import { GstReturnController } from './gst-return.controller';
import { GstReturn } from './gst-return.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GstReturn])],
  controllers: [GstReturnController],
  providers: [GstReturnService],
})
export class GstReturnModule {}
