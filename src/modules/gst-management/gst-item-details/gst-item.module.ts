import { Module } from '@nestjs/common';
import { GstItemService } from './gst-item.service';
import { GstItemController } from './gst-item.controller';

@Module({
  providers: [GstItemService],
  controllers: [GstItemController]
})
export class GstItemModule {}
