import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Put,
} from '@nestjs/common';
import { ConsignorService } from './consignor.service';
import { CreateConsignorDto } from './dto/create-consignor.dto';
import { UpdateConsignorDto } from './dto/update-consignor.dto';

@Controller('consignor')
export class ConsignorController {
    constructor(private readonly consignorService: ConsignorService) { }

    @Post()
    create(@Body() dto: CreateConsignorDto) {
        return this.consignorService.create(dto);
    }

    @Get()
    findAll() {
        return this.consignorService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.consignorService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateConsignorDto) {
        return this.consignorService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.consignorService.remove(+id);
    }
}
