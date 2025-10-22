import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProduct = {
    product_id: 1,
    product_name: 'Test Product',
    product_code: 'P001',
    base_price: 100,
    cost_price: 80,
  };

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
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should call service.create with correct data', async () => {
      mockService.create.mockResolvedValue(mockProduct);
      const dto: CreateProductDto = {
        product_name: 'Test Product',
        product_code: 'P001',
        base_price: 100,
        cost_price: 80,
      } as CreateProductDto;
      const result = await controller.create(dto);
      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(dto, undefined);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      mockService.findAll.mockResolvedValue([mockProduct]);
      const result = await controller.findAll();
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      mockService.findOne.mockResolvedValue(mockProduct);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      mockService.update.mockResolvedValue({ ...mockProduct, product_name: 'Updated' });
      const dto: UpdateProductDto = { product_name: 'Updated' };
      const result = await controller.update('1', dto);
      expect(result.product_name).toBe('Updated');
      expect(service.update).toHaveBeenCalledWith(1, dto, undefined);
    });
  });

  describe('remove', () => {
    it('should call remove', async () => {
      mockService.remove.mockResolvedValue(undefined);
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findByName', () => {
    it('should search products by name', async () => {
      mockService.findByName.mockResolvedValue([mockProduct]);
      const result = await controller.findByName('Test');
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('findByBarcode', () => {
    it('should search product by barcode', async () => {
      mockService.findByBarcode.mockResolvedValue(mockProduct);
      const result = await controller.findByBarcode('12345');
      expect(result).toEqual(mockProduct);
    });
  });
});
