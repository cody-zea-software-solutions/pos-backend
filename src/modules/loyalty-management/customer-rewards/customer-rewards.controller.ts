import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CustomerRewardsService } from './customer-rewards.service';
import { CreateCustomerRewardsDto } from './dto/create-rewards.dto';
import { UpdateCustomerRewardsDto } from './dto/update-rewards.dto';

@Controller('customer-rewards')
export class CustomerRewardsController {
    constructor(private readonly customerRewardsService: CustomerRewardsService) {}

  @Post()
  create(@Body() dto: CreateCustomerRewardsDto) {
    return this.customerRewardsService.create(dto);
  }

  @Get()
  findAll() {
    return this.customerRewardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerRewardsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerRewardsDto) {
    return this.customerRewardsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerRewardsService.remove(+id);
  }
}