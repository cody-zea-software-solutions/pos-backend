import { Test, TestingModule } from '@nestjs/testing';
import { InventoryReportsController } from './inventory-reports.controller';
import { InventoryReportsService } from './inventory-reports.service';
import { StockReportFilterDto } from './dto/stock-report-filter.dto';

describe('InventoryReportsController', () => {
  let controller: InventoryReportsController;
  let service: InventoryReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryReportsController],
      providers: [
        {
          provide: InventoryReportsService,
          useValue: {
            getStockReport: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InventoryReportsController>(InventoryReportsController);
    service = module.get<InventoryReportsService>(InventoryReportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStockReport', () => {
    it('should call service.getStockReport with the provided filter', async () => {
      const filter: StockReportFilterDto = {
        shop_id: 1,
        start_date: '2025-01-01' as any,
        end_date: '2025-01-31' as any,
      };

      const mockReport = [
        {
          product_code: 'P001',
          product_name: 'Test Product',
          unit: 'pcs',
          category: 'Electronics',
          opening_stock: 10,
          stock_in: 5,
          stock_out: 3,
          closing_stock: 12,
          stock_value: 1200,
        },
      ];

      (service.getStockReport as jest.Mock).mockResolvedValue(mockReport);

      const result = await controller.getStockReport(filter);

      expect(service.getStockReport).toHaveBeenCalledWith(filter);
      expect(result).toEqual(mockReport);
    });
  });
});
