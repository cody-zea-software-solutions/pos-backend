import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ServiceResourcesRequirementsService } from './service-resource-requirements.service';
import { CreateServiceResourceRequirementDto } from './dto//create-service-resource-requirements.dto';
import { UpdateServiceResourceRequirementDto } from './dto//update-service-resource-requirements.dto';

@Controller('service-resource-requirements')
export class ServiceResourcesRequirementsController {
  constructor(private readonly service: ServiceResourcesRequirementsService) {}

  //POST /service-resource-requirements
  @Post()
  create(@Body() dto: CreateServiceResourceRequirementDto) {
    return this.service.create(dto);
  }

  //GET /service-resource-requirements
  @Get()
  findAll() {
    return this.service.findAll();
  }

  //GET /service-resource-requirements/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  // PATCH /service-resource-requirements/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceResourceRequirementDto) {
    return this.service.update(+id, dto);
  }

  // DELETE /service-resource-requirements/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
