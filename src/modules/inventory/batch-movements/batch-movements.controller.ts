import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { BatchMovementsService } from './batch-movements.service';
import { CreateBatchMovementDto } from './dto/create-batch-movement.dto';
import { UpdateBatchMovementDto } from './dto/update-batch-movement.dto';

@Controller('batch-movements')
export class BatchMovementsController {
    constructor(private readonly service: BatchMovementsService) { }

    @Post()
    create(@Body() dto: CreateBatchMovementDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.service.findOne(id);
    }

    // @Put(':id')
    // update(@Param('id') id: number, @Body() dto: UpdateBatchMovementDto) {
    //     return this.service.update(id, dto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: number) {
    //     return this.service.remove(id);
    // }
}
