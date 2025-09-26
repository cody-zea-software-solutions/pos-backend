import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByName: jest.fn(),
    findByBarcode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create without file', async () => {
      const dto = { product_name: 'Test', product_code: 'P1', base_price: 10, cost_price: 5 };
      const created = { product_id: 1, ...dto };

      mockService.create.mockResolvedValue(created);

      const result = await controller.create(dto as any); // file optional
      expect(mockService.create).toHaveBeenCalledWith(dto, undefined);
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [{ product_id: 1 }];
      mockService.findAll.mockResolvedValue(products);

      const result = await controller.findAll();
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      const product = { product_id: 1 };
      mockService.findOne.mockResolvedValue(product);

      const result = await controller.findOne('1');
      expect(result).toEqual(product);
    });
  });

  describe('update', () => {
    it('should call service.update without file', async () => {
      const dto = { product_name: 'Updated' };
      const updated = { product_id: 1, product_name: 'Updated' };

      mockService.update.mockResolvedValue(updated);

      const result = await controller.update('1', dto as any); // file optional
      expect(mockService.update).toHaveBeenCalledWith(1, dto, undefined);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      mockService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');
      expect(mockService.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });

  describe('findByName', () => {
    it('should return products by name', async () => {
      const products = [{ product_id: 1, product_name: 'Test' }];
      mockService.findByName.mockResolvedValue(products);

      const result = await controller.findByName('Test');
      expect(result).toEqual(products);
      expect(mockService.findByName).toHaveBeenCalledWith('Test');
    });
  });

  describe('findByBarcode', () => {
    it('should return product by barcode', async () => {
      const product = { product_id: 1, barcode: '123' };
      mockService.findByBarcode.mockResolvedValue(product);

      const result = await controller.findByBarcode('123');
      expect(result).toEqual(product);
      expect(mockService.findByBarcode).toHaveBeenCalledWith('123');
    });
  });
});
