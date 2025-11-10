import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe } from '@nestjs/common';
import { CashDrawerRollbacksService } from './cash-drawer-rollbacks.service';
import { CreateCashDrawerRollbackDto } from './dto/create-cash-drawer-rollbacks.dto';
import { UpdateCashDrawerRollbackDto } from './dto/update-cash-drawer-rollbacks.dto';

@Controller('cash-drawer-rollbacks')
export class CashDrawerRollbacksController {
  constructor(private readonly rollbacksService: CashDrawerRollbacksService) {}

  // POST /cash-drawer-rollbacks
  @Post()
  create(@Body() createDto: CreateCashDrawerRollbackDto) {
    return this.rollbacksService.create(createDto);
  }

  // GET /cash-drawer-rollbacks
  @Get()
  findAll() {
    return this.rollbacksService.findAll();
  }

  // GET /cash-drawer-rollbacks/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rollbacksService.findOne(id);
  }

  // PATCH /cash-drawer-rollbacks/:id
  /*@Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCashDrawerRollbackDto,
  ) {
    return this.rollbacksService.update(id, updateDto);
  }

  // DELETE /cash-drawer-rollbacks/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rollbacksService.remove(id);
  }
    */
}
