export class StockReportItemDto {
  product_code: string;
  product_name: string;
  variation_name?: string;
  unit: string;
  category: string;
  opening_stock: number;
  stock_in: number;
  stock_out: number;
  closing_stock: number;
  stock_value: number;
}