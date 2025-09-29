import { Test, TestingModule } from '@nestjs/testing';
import { ProductSubcategoryService } from './product-subcategory.service';
import { ProductSubcategory } from './product-subcategory.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductSubcategoryService', () => {
  let service: ProductSubcategoryService;
  let repo: jest.Mocked<Repository<ProductSubcategory>>;
  let categoryService: { findOne: jest.Mock };

  const mockCategory = {
    category_id: 1,
    category_code: 'CAT001',
    category_name: 'Electronics',
  };

  const mockSubcategory: ProductSubcategory = {
    subcategory_id: 1,
    subcategory_name: 'Smartphones',
    subcategory_code: 'SUB001',
    description: '',
    sort_order: 0,
    is_active: true,
    created_at: new Date(),
    default_hsn_code:'',
    default_gst_rate: 0,
    category: mockCategory as any,
    products: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductSubcategoryService,
        {
          provide: getRepositoryToken(ProductSubcategory),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: ProductCategoryService,
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ProductSubcategoryService>(ProductSubcategoryService);
    repo = module.get(getRepositoryToken(ProductSubcategory));
    categoryService = module.get(ProductCategoryService);
  });

  describe('create', () => {
    it('should throw conflict if subcategory_code exists', async () => {
      repo.findOne.mockResolvedValue(mockSubcategory);
      await expect(
        service.create({
          subcategory_code: 'SUB001',
          subcategory_name: 'Test',
          category_id: 1,
        } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw not found if category does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      categoryService.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          subcategory_code: 'SUB002',
          subcategory_name: 'Test',
          category_id: 999,
        } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create and save subcategory', async () => {
      repo.findOne.mockResolvedValue(null);
      categoryService.findOne.mockResolvedValue(mockCategory);
      repo.create.mockReturnValue(mockSubcategory);
      repo.save.mockResolvedValue(mockSubcategory);

      const result = await service.create({
        subcategory_code: 'SUB002',
        subcategory_name: 'Laptops',
        category_id: 1,
      } as any);

      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockSubcategory);
    });
  });

  describe('findAll', () => {
    it('should return all subcategories', async () => {
      repo.find.mockResolvedValue([mockSubcategory]);
      const result = await service.findAll();
      expect(result).toEqual([mockSubcategory]);
      expect(repo.find).toHaveBeenCalledWith({ relations: ['category'] });
    });
  });

  describe('findOne', () => {
    it('should throw not found if missing', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return subcategory', async () => {
      repo.findOne.mockResolvedValue(mockSubcategory);
      const result = await service.findOne(1);
      expect(result).toEqual(mockSubcategory);
    });
  });

  describe('update', () => {
    it('should throw conflict if code already exists', async () => {
      repo.findOne
        .mockResolvedValueOnce(mockSubcategory) // current
        .mockResolvedValueOnce(mockSubcategory); // duplicate
      await expect(
        service.update(1, { subcategory_code: 'SUB001' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should update and save subcategory', async () => {
      repo.findOne.mockResolvedValueOnce(mockSubcategory).mockResolvedValueOnce(null);
      categoryService.findOne.mockResolvedValue(mockCategory);
      repo.save.mockResolvedValue({ ...mockSubcategory, subcategory_name: 'Updated' });

      const result = await service.update(1, { subcategory_name: 'Updated', category_id: 1 } as any);
      expect(result.subcategory_name).toEqual('Updated');
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove subcategory', async () => {
      repo.findOne.mockResolvedValue(mockSubcategory);
      repo.remove.mockResolvedValue(mockSubcategory);

      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockSubcategory);
    });
  });
});
