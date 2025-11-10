import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe } from '@nestjs/common';
import { CashDrawerLogsService } from './cash-drawer-logs.service';
import { CreateCashDrawerLogsDto } from './dto/create-cash-drawer-logs.dto';
import { UpdateCashDrawerLogsDto } from './dto/update-cash-drawer-logs.dto';

@Controller('cash-drawer-logs')
export class CashDrawerLogsController {
  constructor(private readonly cashDrawerLogsService: CashDrawerLogsService) {}

  @Post()
  create(@Body() dto: CreateCashDrawerLogsDto) {
    return this.cashDrawerLogsService.create(dto);
  }

  @Get()
  findAll() {
    return this.cashDrawerLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cashDrawerLogsService.findOne(id);
  }
/*
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCashDrawerLogsDto) {
    return this.cashDrawerLogsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cashDrawerLogsService.remove(id);
  }
*/
}
