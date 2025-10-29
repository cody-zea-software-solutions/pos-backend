import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CashDrawerRollbacksService } from './cash-drawer-rollbacks.service';
import { CreateCashDrawerRollbackDto } from './dto/create-cash-drawer-rollbacks.dto';
import { UpdateCashDrawerRollbackDto } from './dto/update-cash-drawer-rollbacks.dto';
import { CashDrawerRollback } from './cash-drawer-rollbacks.entity';

@Controller('cash-drawer-rollbacks')
export class CashDrawerRollbacksController {
  constructor(private readonly service: CashDrawerRollbacksService) {}

  @Post()
  create(@Body() dto: CreateCashDrawerRollbackDto): Promise<CashDrawerRollback> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<CashDrawerRollback[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CashDrawerRollback> {
    return this.service.findOne(+id);
  }

 /* @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCashDrawerRollbackDto): Promise<CashDrawerRollback> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }*/
}
