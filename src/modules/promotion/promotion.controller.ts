import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Controller('promotion')
export class PromotionController {
    constructor(private readonly promotionService: PromotionService) { }

    @Post()
    create(@Body() dto: CreatePromotionDto) {
        return this.promotionService.create(dto);
    }

    @Get()
    findAll() {
        return this.promotionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.promotionService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
        return this.promotionService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.promotionService.remove(+id);
    }
}
