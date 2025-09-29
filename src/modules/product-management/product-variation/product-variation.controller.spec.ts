import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariationController } from './product-variation.controller';
import { ProductVariationService } from './product-variation.service';
import { ProductVariation } from './product-variation.entity';

describe('ProductVariationController', () => {
  let controller: ProductVariationController;
  let service: ProductVariationService;

  const mockProduct = { product_id: 1, name: 'Phone' } as any;
  const mockVariation: ProductVariation = {
    variation_id: 1,
    variation_name: 'Black',
    variation_code: 'VAR001',
    variation_type: 'COLOR',
    variation_value: 'Black',
    price_adjustment: 0,
    cost_adjustment: 0,
    barcode: '12345',
    auto_generate_barcode: false,
    stock_quantity: 10,
    is_active: true,
    created_at: new Date(),
    hsn_code: 'HSN001',
    gst_rate: 5,
    inherit_parent_gst: true,
    product: mockProduct,
    transactionItems: [],
    refund_items: [],
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockVariation),
    findAll: jest.fn().mockResolvedValue([mockVariation]),
    findOne: jest.fn().mockResolvedValue(mockVariation),
    update: jest.fn().mockResolvedValue({ ...mockVariation, variation_name: 'Red' }),
    remove: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue([mockVariation]),
    findByBarcode: jest.fn().mockResolvedValue(mockVariation),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariationController],
      providers: [{ provide: ProductVariationService, useValue: mockService }],
    }).compile();

    controller = module.get<ProductVariationController>(ProductVariationController);
    service = module.get<ProductVariationService>(ProductVariationService);
  });

  it('should create variation', async () => {
    const result = await controller.create({ variation_name: 'Black', product_id: 1 } as any);
    expect(result).toEqual(mockVariation);
    expect(mockService.create).toHaveBeenCalled();
  });

  it('should return all variations', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockVariation]);
  });

  it('should return one variation', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockVariation);
  });

  it('should update variation', async () => {
    const result = await controller.update('1', { variation_name: 'Red' } as any);
    expect(result.variation_name).toEqual('Red');
  });

  it('should remove variation', async () => {
    const result = await controller.remove('1');
    expect(result).toBeUndefined();
  });

  it('should find by name', async () => {
    const result = await controller.findByName('Black');
    expect(result).toEqual([mockVariation]);
  });

  it('should find by barcode', async () => {
    const result = await controller.findByBarcode('12345');
    expect(result).toEqual(mockVariation);
  });
});
