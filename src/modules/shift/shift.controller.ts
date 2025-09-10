import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Controller('shift')
export class ShiftController {
    constructor(private readonly shiftService: ShiftService) { }

    @Post()
    create(@Body() dto: CreateShiftDto) {
        return this.shiftService.create(dto);
    }

    @Get()
    findAll() {
        return this.shiftService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.shiftService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateShiftDto,
    ){
        return this.shiftService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number){
        return this.shiftService.remove(id);
    }

    @Post(':id')
    endShift(@Param('id', ParseIntPipe) id: number){
        return this.shiftService.endShiftForCashier(id);
    }
}
