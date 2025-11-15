import { Controller, 
  Get, 
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe } from '@nestjs/common';
import { ServiceCategoriesService } from './service-categories.service';
import { CreateServiceCategoryDto } from './dto/create-service-categories.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-categories.dto';

@Controller('service-categories')
export class ServiceCategoriesController {
  constructor(private readonly serviceCategoriesService: ServiceCategoriesService) {}

  // Create a new category
  @Post()
  async create(@Body() dto: CreateServiceCategoryDto) {
    return await this.serviceCategoriesService.create(dto);
  }

  // Get all categories
  @Get()
  async findAll() {
    return await this.serviceCategoriesService.findAll();
  }

  //Get one by ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.serviceCategoriesService.findOne(id);
  }

  // Update a category
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceCategoryDto,
  ) {
    return await this.serviceCategoriesService.update(id, dto);
  }

  //Delete a category
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.serviceCategoriesService.remove(id);
  }
}
