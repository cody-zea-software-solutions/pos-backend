import { Module } from '@nestjs/common';
import { GstReturnController } from './gst-return.controller';
import { GstReturnService } from './gst-return.service';

@Module({
  controllers: [GstReturnController],
  providers: [GstReturnService]
})
export class GstReturnModule {}
