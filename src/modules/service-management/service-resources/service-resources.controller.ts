import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ServiceResourcesService } from './service-resources.service';
import { CreateServiceResourceDto } from './dto/create-service-resources.dto';
import { UpdateServiceResourceDto } from './dto/update-service-resources.dto';

@Controller('service-resources')
export class ServiceResourcesController {
  constructor(private readonly serviceResourcesService: ServiceResourcesService) {}

  @Post()
  create(@Body() dto: CreateServiceResourceDto) {
    return this.serviceResourcesService.create(dto);
  }

  @Get()
  findAll() {
    return this.serviceResourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.serviceResourcesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateServiceResourceDto) {
    return this.serviceResourcesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.serviceResourcesService.remove(id);
  }
}
