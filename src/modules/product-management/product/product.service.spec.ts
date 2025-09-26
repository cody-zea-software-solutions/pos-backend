import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { ProductGroupService } from '../product-group/product-group.service';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubcategoryService } from '../product-subcategory/product-subcategory.service';
import { ProductUnitsService } from '../product-units/product-units.service';
import { ConsignorService } from '../../inventory/consignor/consignor.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository<Product>;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockGroupService = { findOne: jest.fn() };
  const mockCategoryService = { findOne: jest.fn() };
  const mockSubcategoryService = { findOne: jest.fn() };
  const mockUnitService = { findOne: jest.fn() };
  const mockConsignorService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useValue: mockRepo },
        { provide: ProductGroupService, useValue: mockGroupService },
        { provide: ProductCategoryService, useValue: mockCategoryService },
        { provide: ProductSubcategoryService, useValue: mockSubcategoryService },
        { provide: ProductUnitsService, useValue: mockUnitService },
        { provide: ConsignorService, useValue: mockConsignorService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product without file', async () => {
      const dto = {
        product_name: 'Test Product',
        product_code: 'P123',
        base_price: 100,
        cost_price: 80,
      };

      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue(dto);
      mockRepo.save.mockResolvedValue({ product_id: 1, ...dto });

      const result = await service.create(dto as any); // file optional
      expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining(dto));
      expect(result).toEqual(expect.objectContaining({ product_id: 1 }));
    });

    it('should throw ConflictException if product_code exists', async () => {
      mockRepo.findOne.mockResolvedValue({ product_code: 'P123' });

      await expect(
        service.create({ product_name: 'Dup', product_code: 'P123', base_price: 10, cost_price: 5 } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      mockRepo.findOne.mockResolvedValue({ product_id: 1 });
      const result = await service.findOne(1);
      expect(result).toEqual({ product_id: 1 });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should call repo.remove', async () => {
      const product = { product_id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(product as Product);
      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalledWith(product);
    });
  });
});
