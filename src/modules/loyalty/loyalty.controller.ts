import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { CreateLoyaltyDto } from './dto/create-loyalty.dto';
import { UpdateLoyaltyDto } from './dto/update-loyalty.dto';
@Controller('loyalty')
export class LoyaltyController {
constructor(private readonly loyaltyService: LoyaltyService) {}

  @Post()
  create(@Body() dto: CreateLoyaltyDto) {
    return this.loyaltyService.create(dto);
  }

  @Get()
  findAll() {
    return this.loyaltyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.loyaltyService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateLoyaltyDto) {
    return this.loyaltyService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.loyaltyService.remove(id);
  }


}
