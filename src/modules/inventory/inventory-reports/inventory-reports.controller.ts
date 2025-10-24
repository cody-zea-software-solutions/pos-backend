import { Controller, Get, Query } from '@nestjs/common';
import { InventoryReportsService } from './inventory-reports.service';
import { StockReportFilterDto } from './dto/stock-report-filter.dto';

@Controller('inventory-reports')
export class InventoryReportsController {
    constructor(private readonly reportsService: InventoryReportsService) { }

    @Get('stock')
    async getStockReport(@Query() filter: StockReportFilterDto) {
        return this.reportsService.getStockReport(filter);
    }
}
