import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

describe('ProductCategoryController', () => {
  let controller: ProductCategoryController;
  let service: ProductCategoryService;

  const mockCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCategoryController],
      providers: [
        {
          provide: ProductCategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<ProductCategoryController>(ProductCategoryController);
    service = module.get<ProductCategoryService>(ProductCategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct data', async () => {
      const dto: CreateProductCategoryDto = {
        category_code: 'CAT001',
        category_name: 'Electronics',
        group_id: 1,
      };

      mockCategoryService.create.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      mockCategoryService.findAll.mockResolvedValue([{ category_id: 1 }]);
      const result = await controller.findAll();
      expect(result).toEqual([{ category_id: 1 }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      mockCategoryService.findOne.mockResolvedValue({ category_id: 1 });
      const result = await controller.findOne(1);
      expect(result).toEqual({ category_id: 1 });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call service.update with correct params', async () => {
      const dto: UpdateProductCategoryDto = { category_name: 'Updated Name' };
      mockCategoryService.update.mockResolvedValue({ category_id: 1, ...dto });

      const result = await controller.update(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ category_id: 1, ...dto });
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      mockCategoryService.remove.mockResolvedValue({ deleted: true });
      const result = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });
  });
});
