import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { LoyaltyPointsService } from './loyalty-points.service';
import { CreateLoyaltyPointsDto } from './dto/create-loyalty-points.dto';
import { UpdateLoyaltyPointsDto } from './dto/update-loyalty-points.dto';

@Controller('loyalty-points')
export class LoyaltyPointsController {
  constructor(private readonly loyaltyPointsService: LoyaltyPointsService) {}

  @Get()
  findAll() {
    return this.loyaltyPointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.loyaltyPointsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.loyaltyPointsService.remove(id);
  }
}
