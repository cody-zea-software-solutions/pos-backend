import { Test, TestingModule } from '@nestjs/testing';
import { ProductSubcategoryController } from './product-subcategory.controller';
import { ProductSubcategoryService } from './product-subcategory.service';

describe('ProductSubcategoryController', () => {
  let controller: ProductSubcategoryController;
  let service: ProductSubcategoryService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSubcategoryController],
      providers: [
        {
          provide: ProductSubcategoryService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get(ProductSubcategoryController);
    service = module.get(ProductSubcategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create', async () => {
    const dto = { subcategory_name: 'Test' };
    mockService.create.mockResolvedValue(dto);
    const result = await controller.create(dto as any);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should call service.findAll', async () => {
    mockService.findAll.mockResolvedValue([]);
    const result = await controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should call service.findOne', async () => {
    const resultMock = { subcategory_id: 1 };
    mockService.findOne.mockResolvedValue(resultMock);
    const result = await controller.findOne(1);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(resultMock);
  });

  it('should call service.update', async () => {
    const dto = { subcategory_name: 'Updated' };
    mockService.update.mockResolvedValue(dto);
    const result = await controller.update(1, dto as any);
    expect(mockService.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(dto);
  });

  it('should call service.remove', async () => {
    mockService.remove.mockResolvedValue(undefined);
    const result = await controller.remove(1);
    expect(mockService.remove).toHaveBeenCalledWith(1);
    expect(result).toBeUndefined();
  });
});
