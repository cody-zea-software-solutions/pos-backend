import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { StockReportFilterDto } from './dto/stock-report-filter.dto';
import { StockReportItemDto } from './dto/stock-report-item.dto';
import { ShopInventory } from '../shop-inventory/shop-inventory.entity';

@Injectable()
export class InventoryReportsService {
  constructor(
    @InjectRepository(ShopInventory)
    private readonly inventoryRepo: Repository<ShopInventory>,
  ) {}

  async getStockReport(filter: StockReportFilterDto): Promise<StockReportItemDto[]> {
    const { shop_id, start_date, end_date } = filter;

    // Fetch all inventory items for the selected shop with product and variation details
    const inventories = await this.inventoryRepo.find({
      where: { shop: { shop_id } },
      relations: [
        'product',
        'product.unit',
        'product.category',
        'variation',
      ],
    });

    const report: StockReportItemDto[] = [];

    for (const inv of inventories) {
      const product = inv.product;
      const variation = inv.variation;

      // --- Calculate Opening Stock ---
      let openingStock = inv.available_quantity;
      if (start_date) {
        const lastBeforeStart = await this.inventoryRepo.findOne({
          where: {
            shop: { shop_id },
            product: { product_id: product.product_id },
            last_updated: LessThanOrEqual(new Date(start_date)),
          },
        });
        openingStock = lastBeforeStart?.available_quantity || 0;
      }

      // --- Calculate Stock In/Out (simple version, can improve later) ---
      const stockIn = Math.max(inv.available_quantity - openingStock, 0);
      const stockOut = Math.max(openingStock - inv.available_quantity, 0);

      const closingStock = inv.available_quantity;
      const stockValue = closingStock * (product.cost_price || 0);

      // --- Safe relation access ---
      const unitName = product.unit?.unit_name || '';
      const categoryName = product.category?.category_name || '';
      const variationName = variation?.variation_name || '';

      report.push({
        product_code: product.product_code,
        product_name: product.product_name,
        variation_name: variationName,
        unit: unitName,
        category: categoryName,
        opening_stock: openingStock,
        stock_in: stockIn,
        stock_out: stockOut,
        closing_stock: closingStock,
        stock_value: stockValue,
      });
    }

    return report;
  }
}