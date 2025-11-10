import { Test, TestingModule } from '@nestjs/testing';
import { InventoryReportsService } from './inventory-reports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShopInventory } from '../shop-inventory/shop-inventory.entity';
import { Repository } from 'typeorm';
import { StockReportFilterDto } from './dto/stock-report-filter.dto';

describe('InventoryReportsService', () => {
  let service: InventoryReportsService;
  let repo: Repository<ShopInventory>;

  const mockInventory = {
    available_quantity: 10,
    product: {
      product_id: 1,
      product_code: 'P001',
      product_name: 'Laptop',
      cost_price: 1000,
      unit: { unit_name: 'pcs' },
      category: { category_name: 'Electronics' },
    },
    variation: { variation_name: 'Silver' },
  };

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryReportsService,
        {
          provide: getRepositoryToken(ShopInventory),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<InventoryReportsService>(InventoryReportsService);
    repo = module.get<Repository<ShopInventory>>(getRepositoryToken(ShopInventory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStockReport', () => {
    it('should return a stock report array', async () => {
      mockRepo.find.mockResolvedValue([mockInventory]);
      mockRepo.findOne.mockResolvedValue({ available_quantity: 8 });

      const filter: StockReportFilterDto = {
        shop_id: 1,
        start_date: '2025-01-01' as any,
        end_date: '2025-01-31' as any,
      };

      const result = await service.getStockReport(filter);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('product_code', 'P001');
      expect(result[0].opening_stock).toBe(8);
      expect(result[0].closing_stock).toBe(10);
      expect(mockRepo.find).toHaveBeenCalled();
    });

    it('should handle empty inventory gracefully', async () => {
      mockRepo.find.mockResolvedValue([]);
      const filter: StockReportFilterDto = { shop_id: 2 };

      const result = await service.getStockReport(filter);

      expect(result).toEqual([]);
    });
  });
});
