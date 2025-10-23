import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    ParseIntPipe,
    Put,
} from '@nestjs/common';
import { ConsignmentSettlementsService } from './consignment-settlements.service';
import { CreateConsignmentSettlementDto } from './dto/create-consignment-settlement.dto';
import { UpdateConsignmentSettlementDto } from './dto/update-consignment-settlement.dto';

@Controller('consignment-settlements')
export class ConsignmentSettlementsController {
    constructor(
        private readonly settlementsService: ConsignmentSettlementsService,
    ) { }

    @Post()
    create(@Body() dto: CreateConsignmentSettlementDto) {
        return this.settlementsService.create(dto);
    }

    @Get()
    findAll() {
        return this.settlementsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.settlementsService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateConsignmentSettlementDto,
    ) {
        return this.settlementsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.settlementsService.remove(id);
    }
}
