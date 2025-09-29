import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
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
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto: CreateProductDto = {
        product_name: 'Test Product',
        product_code: 'P001',
        base_price: 100,
        cost_price: 80,
      };

      const mockProduct = { ...dto, product_id: 1, is_active: true };
      mockProductService.create.mockResolvedValue(mockProduct);

      expect(await controller.create(dto)).toEqual(mockProduct);
      expect(mockProductService.create).toHaveBeenCalledWith(dto, undefined);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const result = [{ product_id: 1, product_name: 'Test' }];
      mockProductService.findAll.mockResolvedValue(result);
      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const result = { product_id: 1 };
      mockProductService.findOne.mockResolvedValue(result);
      expect(await controller.findOne('1')).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const dto: UpdateProductDto = { product_name: 'Updated' };
      const result = { product_id: 1, ...dto };
      mockProductService.update.mockResolvedValue(result);
      expect(await controller.update('1', dto)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockProductService.remove.mockResolvedValue(undefined);
      await controller.remove('1');
      expect(mockProductService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findByName', () => {
    it('should search products by name', async () => {
      const result = [{ product_id: 1, product_name: 'Test' }];
      mockProductService.findByName.mockResolvedValue(result);
      expect(await controller.findByName('Test')).toEqual(result);
    });
  });

  describe('findByBarcode', () => {
    it('should search product by barcode', async () => {
      const result = { product_id: 1, product_code: 'P001' };
      mockProductService.findByBarcode.mockResolvedValue(result);
      expect(await controller.findByBarcode('12345')).toEqual(result);
    });
  });
});
