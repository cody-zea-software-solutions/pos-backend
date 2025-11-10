import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryService } from './product-category.service';
import { ProductCategory } from './product-category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductGroupService } from '../product-group/product-group.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;
  let repo: jest.Mocked<Repository<ProductCategory>>;
  let groupService: { findOne: jest.Mock };

  const mockCategory = {
  category_id: 1,
  category_code: 'CAT001',
  category_name: 'Electronics',
  group: {} as any,
  parent: undefined,
  children: [],
} as unknown as ProductCategory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCategoryService,
        {
          provide: getRepositoryToken(ProductCategory),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: ProductGroupService,
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ProductCategoryService>(ProductCategoryService);
    repo = module.get(getRepositoryToken(ProductCategory));
    groupService = module.get(ProductGroupService);
  });

  describe('create', () => {
    it('should throw conflict if category_code exists', async () => {
      repo.findOne.mockResolvedValue(mockCategory);

      await expect(
        service.create({ category_code: 'CAT001', category_name: 'Test', group_id: 1 }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw not found if group not exists', async () => {
      repo.findOne.mockResolvedValue(null);
      groupService.findOne.mockResolvedValue(null);

      await expect(
        service.create({ category_code: 'CAT002', category_name: 'Test', group_id: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create and save category', async () => {
      repo.findOne.mockResolvedValue(null);
      groupService.findOne.mockResolvedValue({ id: 1 });
      repo.create.mockReturnValue(mockCategory);
      repo.save.mockResolvedValue(mockCategory);

      const result = await service.create({
        category_code: 'CAT002',
        category_name: 'Phones',
        group_id: 1,
      } as any);

      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      repo.find.mockResolvedValue([mockCategory]);
      const result = await service.findAll();
      expect(result).toEqual([mockCategory]);
      expect(repo.find).toHaveBeenCalledWith({
        relations: ['group', 'parent', 'children'],
      });
    });
  });

  describe('findOne', () => {
    it('should throw not found if category missing', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return category', async () => {
      repo.findOne.mockResolvedValue(mockCategory);
      const result = await service.findOne(1);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('update', () => {
  it('should throw conflict if category_code exists', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockCategory);
    repo.findOne.mockResolvedValueOnce(mockCategory); // duplicate

    await expect(
      service.update(1, { category_code: 'CAT001' } as any),
    ).rejects.toThrow(ConflictException);
  });

  it('should update and save category', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockCategory);
    repo.findOne.mockResolvedValue(null); // no duplicate
    groupService.findOne.mockResolvedValue({ id: 1 });
    repo.save.mockResolvedValue({ ...mockCategory, category_name: 'Updated' });

    const result = await service.update(1, {
      category_name: 'Updated',
      group_id: 1,
    } as any);

    expect(result.category_name).toEqual('Updated');
    expect(repo.save).toHaveBeenCalled();
  });
});

  describe('remove', () => {
    it('should remove category', async () => {
      repo.findOne.mockResolvedValue(mockCategory);
      repo.remove.mockResolvedValue(mockCategory);

      await service.remove(1);

      expect(repo.remove).toHaveBeenCalledWith(mockCategory);
    });
  });
});
