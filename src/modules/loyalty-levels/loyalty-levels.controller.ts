import { Controller,Get, Post, Body, Param, Put, Delete  } from '@nestjs/common';
import { LoyaltyLevelsService} from './loyalty-levels.service';
import { CreateLoyaltyLevelsDto } from './dto/create-loyalty-levels.dto';
import { UpdateLoyaltyLevelsDto } from './dto/update-loyalty-levels.dto';

@Controller('loyalty-levels')
export class LoyaltyLevelsController {

    constructor(private readonly loyaltylevelsService: LoyaltyLevelsService) {}
    
      @Post()
      create(@Body() dto: CreateLoyaltyLevelsDto) {
        return this.loyaltylevelsService.create(dto);
      }
    
      @Get()
      findAll() {
        return this.loyaltylevelsService.findAll();
      }
    
      @Get(':id')
      findOne(@Param('id') id: number) {
        return this.loyaltylevelsService.findOne(id);
      }
    
      @Put(':id')
      update(@Param('id') id: number, @Body() dto: UpdateLoyaltyLevelsDto) {
        return this.loyaltylevelsService.update(id, dto);
      }
    
      @Delete(':id')
      remove(@Param('id') id: number) {
        return this.loyaltylevelsService.remove(id);
      }
}
