import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductGroupService } from '../product-group/product-group.service';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubcategoryService } from '../product-subcategory/product-subcategory.service';
import { ProductUnitsService } from '../product-units/product-units.service';
import { ConsignorService } from '../../inventory/consignor/consignor.service';
import { SubscriptionPlanService } from '../../subscription-plan/subscription-plan.service';

describe('ProductService', () => {
  let service: ProductService;
  let repo: jest.Mocked<Repository<Product>>;

  const mockProduct: Product = {
    product_id: 1,
    product_name: 'Test Product',
    product_code: 'P001',
    base_price: 100,
    cost_price: 80,
  } as Product;

  const mockRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockGroupService = { findOne: jest.fn() };
  const mockCategoryService = { findOne: jest.fn() };
  const mockSubcategoryService = { findOne: jest.fn() };
  const mockUnitService = { findOne: jest.fn() };
  const mockConsignorService = { findOne: jest.fn() };
  const mockSubscriptionPlanService = { validateLimit: jest.fn() };

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
        { provide: SubscriptionPlanService, useValue: mockSubscriptionPlanService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get(getRepositoryToken(Product));
  });

  afterEach(() => jest.clearAllMocks());

  // ---------------------------
  // create()
  // ---------------------------
  describe('create', () => {
    it('should create a product successfully', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockSubscriptionPlanService.validateLimit.mockResolvedValue(true);
      mockRepo.create.mockReturnValue(mockProduct);
      mockRepo.save.mockResolvedValue(mockProduct);

      const result = await service.create(mockProduct);
      expect(result).toEqual(mockProduct);
      expect(repo.create).toHaveBeenCalledWith(expect.objectContaining(mockProduct));
      expect(repo.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if product_code already exists', async () => {
      mockRepo.findOne.mockResolvedValue(mockProduct);
      await expect(service.create(mockProduct)).rejects.toThrow(ConflictException);
    });
  });

  // ---------------------------
  // findAll()
  // ---------------------------
  describe('findAll', () => {
    it('should return all products', async () => {
      mockRepo.find.mockResolvedValue([mockProduct]);
      const result = await service.findAll();
      expect(result).toEqual([mockProduct]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  // ---------------------------
  // findOne()
  // ---------------------------
  describe('findOne', () => {
    it('should return a product', async () => {
      mockRepo.findOne.mockResolvedValue(mockProduct);
      const result = await service.findOne(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------
  // update()
  // ---------------------------
  describe('update', () => {
    it('should update a product successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockProduct);
      mockRepo.findOne.mockResolvedValueOnce(null); // no duplicate found
      mockRepo.save.mockResolvedValue({ ...mockProduct, product_name: 'Updated' });

      const result = await service.update(1, { product_name: 'Updated' });
      expect(result.product_name).toBe('Updated');
      expect(repo.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if product_code already exists', async () => {
      // Simulate existing product (the one we are updating)
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockProduct);

      // Mock two findOne calls in order
      mockRepo.findOne
        .mockResolvedValueOnce(null) // maybe for initial pre-check
        .mockResolvedValueOnce({ ...mockProduct, product_id: 2 }); // duplicate code found

      await expect(
        service.update(1, { product_code: 'P001' })
      ).rejects.toThrow(ConflictException);
    });
  });

  // ---------------------------
  // remove()
  // ---------------------------
  describe('remove', () => {
    it('should remove a product successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockProduct);
      mockRepo.remove.mockResolvedValue(mockProduct);

      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new NotFoundException('Product 1 not found'));

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
