import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { LoyaltyRewardsService } from './loyalty-rewards.service';
import { CreateLoyaltyRewardsDto } from './dto/create-loyalty-rewards.dto';
import { UpdateLoyaltyRewardsDto } from './dto/update-loyalty-rewards.dto';
@Controller('loyalty-rewards')
export class LoyaltyRewardsController {
constructor(private readonly rewardService: LoyaltyRewardsService) {}

  @Post()
  create(@Body() dto: CreateLoyaltyRewardsDto) {
    return this.rewardService.create(dto);
  }

  @Get()
  findAll() {
    return this.rewardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rewardService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateLoyaltyRewardsDto) {
    return this.rewardService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.rewardService.remove(id);
  }

}
