import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductGroupService } from '../product-group/product-group.service';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubcategoryService } from '../product-subcategory/product-subcategory.service';
import { ProductUnitsService } from '../product-units/product-units.service';
import { ConsignorService } from '../../inventory/consignor/consignor.service';

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository<Product>;

  const mockProduct = {
    product_id: 1,
    product_name: 'Test Product',
    product_code: 'P001',
    base_price: 100,
    cost_price: 80,
    is_active: true,
  } as Product;

  const mockRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn().mockReturnValue(mockProduct),
    save: jest.fn().mockResolvedValue(mockProduct),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  const mockDepService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useValue: mockRepo },
        { provide: ProductGroupService, useValue: mockDepService },
        { provide: ProductCategoryService, useValue: mockDepService },
        { provide: ProductSubcategoryService, useValue: mockDepService },
        { provide: ProductUnitsService, useValue: mockDepService },
        { provide: ConsignorService, useValue: mockDepService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const dto = {
        product_name: 'Test Product',
        product_code: 'P001',
        base_price: 100,
        cost_price: 80,
      };
      const result = await service.create(dto as any);
      expect(result).toEqual(mockProduct);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('should throw conflict exception if product_code exists', async () => {
      mockRepo.findOne.mockResolvedValue(mockProduct);
      await expect(
        service.create({ product_code: 'P001' } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      mockRepo.find.mockResolvedValue([mockProduct]);
      expect(await service.findAll()).toEqual([mockProduct]);
    });
  });

  describe('findOne', () => {
    it('should return one product', async () => {
      mockRepo.findOne.mockResolvedValue(mockProduct);
      expect(await service.findOne(1)).toEqual(mockProduct);
    });

    it('should throw not found if missing', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return product', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);
      mockRepo.findOne.mockResolvedValue(null);
      const result = await service.update(1, { product_name: 'Updated' });
      expect(result).toEqual(mockProduct);
    });

    it('should throw conflict if product_code already exists', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);
      mockRepo.findOne.mockResolvedValue(mockProduct);
      await expect(service.update(1, { product_code: 'P001' })).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove product', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);
      await expect(service.remove(1)).resolves.toBeUndefined();
    });
  });

  describe('findByName', () => {
    it('should return products by name', async () => {
      mockRepo.find.mockResolvedValue([mockProduct]);
      expect(await service.findByName('Test')).toEqual([mockProduct]);
    });
  });

  describe('findByBarcode', () => {
    it('should return product by barcode', async () => {
      mockRepo.findOne.mockResolvedValue(mockProduct);
      expect(await service.findByBarcode('123')).toEqual(mockProduct);
    });

    it('should throw not found if barcode missing', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findByBarcode('123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
