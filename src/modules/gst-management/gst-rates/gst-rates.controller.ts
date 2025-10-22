import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GstRatesService } from './gst-rates.service';
import { CreateGstRateDto } from './dto/create-gst-rates.dto';
import { UpdateGstRateDto } from './dto/update-gst-rates.dto';

@Controller('gst-rates')
export class GstRatesController {
  constructor(private readonly gstRatesService: GstRatesService) {}

  @Post()
  create(@Body() dto: CreateGstRateDto) {
    return this.gstRatesService.create(dto);
  }

  @Get()
  findAll() {
    return this.gstRatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.gstRatesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateGstRateDto) {
    return this.gstRatesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.gstRatesService.remove(id);
  }
}
