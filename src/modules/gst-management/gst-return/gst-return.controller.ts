import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GstReturnService } from './gst-return.service';
import { CreateGstReturnDto } from './dto/create-gst-return.dto';
import { UpdateGstReturnDto } from './dto/update-gst-return.dto';

@Controller('gst-return')
export class GstReturnController {
  constructor(private readonly gstReturnService: GstReturnService) {}

  @Post()
  create(@Body() dto: CreateGstReturnDto) {
    return this.gstReturnService.create(dto);
  }

  @Get()
  findAll() {
    return this.gstReturnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gstReturnService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGstReturnDto) {
    return this.gstReturnService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gstReturnService.remove(+id);
  }
}
