import { Controller, Get, Post, Body, Param, Delete, Patch, Put } from '@nestjs/common';
import { SupplierPaymentsService } from './supplier-payments.service';
import { CreateSupplierPaymentDto } from './dto/create-supplier-payment.dto';
import { UpdateSupplierPaymentDto } from './dto/update-supplier-payment.dto';

@Controller('supplier-payments')
export class SupplierPaymentsController {
    constructor(private readonly paymentsService: SupplierPaymentsService) { }

    @Post()
    create(@Body() dto: CreateSupplierPaymentDto) {
        return this.paymentsService.create(dto);
    }

    @Get()
    findAll() {
        return this.paymentsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.paymentsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() dto: UpdateSupplierPaymentDto) {
        return this.paymentsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.paymentsService.remove(id);
    }
}
