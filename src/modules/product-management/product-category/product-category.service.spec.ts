import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryService } from './product-category.service';
import { ProductCategory } from './product-category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;
  let repo: Repository<ProductCategory>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCategoryService,
        {
          provide: getRepositoryToken(ProductCategory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductCategoryService>(ProductCategoryService);
    repo = module.get<Repository<ProductCategory>>(getRepositoryToken(ProductCategory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a category', async () => {
      const dto = { category_code: 'CAT001', category_name: 'Electronics', group_id: 1 };
      mockRepository.create.mockReturnValue(dto);
      mockRepository.save.mockResolvedValue({ category_id: 1, ...dto });

      const result = await service.create(dto as any);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ category_id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      mockRepository.find.mockResolvedValue([{ category_id: 1 }]);
      const result = await service.findAll();
      expect(result).toEqual([{ category_id: 1 }]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockRepository.findOne.mockResolvedValue({ category_id: 1 });
      const result = await service.findOne(1);
      expect(result).toEqual({ category_id: 1 });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { category_id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      const dto = { category_name: 'Updated' };
      const result = await service.update(1, dto as any);
      expect(mockRepository.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
