import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GstItemDetailsService } from './gst-item-details.service';
import { CreateGstItemDetailDto } from './dto/create-gst-item.dto';
import { UpdateGstItemDetailDto } from './dto/update-gst-item.dto';

@Controller('gst-item-details')
export class GstItemDetailsController {
  constructor(private readonly gstItemDetailsService: GstItemDetailsService) {}

  @Post()
  create(@Body() dto: CreateGstItemDetailDto) {
    return this.gstItemDetailsService.create(dto);
  }

  @Get()
  findAll() {
    return this.gstItemDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.gstItemDetailsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateGstItemDetailDto) {
    return this.gstItemDetailsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.gstItemDetailsService.remove(id);
  }
}
