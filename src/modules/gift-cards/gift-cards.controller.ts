import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GiftCardsService } from './gift-cards.service';
import { CreateGiftCardDto } from './dto/create-gift-card.dto';
import { UpdateGiftCardDto } from './dto/update-gift-card.dto';

@Controller('gift-cards')
export class GiftCardsController {
    constructor(private readonly giftCardsService: GiftCardsService) { }

    @Post()
    create(@Body() dto: CreateGiftCardDto) {
        return this.giftCardsService.create(dto);
    }

    @Get()
    findAll() {
        return this.giftCardsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.giftCardsService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateGiftCardDto) {
        return this.giftCardsService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.giftCardsService.remove(+id);
    }

    @Get('search/card-number/:cardNumber')
    findByCardNumber(@Param('cardNumber') cardNumber: string) {
        return this.giftCardsService.findByCardNumber(cardNumber);
    }
}
