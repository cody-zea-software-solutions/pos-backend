import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariationController } from './product-variation.controller';
import { ProductVariationService } from './product-variation.service';
import { CreateProductVariationDto } from './dto/create-product-variation.dto';
import { UpdateProductVariationDto } from './dto/update-product-variation.dto';

describe('ProductVariationController', () => {
  let controller: ProductVariationController;
  let service: ProductVariationService;

  const mockVariation = {
    variation_id: 1,
    variation_name: 'Size M',
    barcode: '123456789',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockVariation),
    findAll: jest.fn().mockResolvedValue([mockVariation]),
    findOne: jest.fn().mockResolvedValue(mockVariation),
    update: jest.fn().mockResolvedValue({ ...mockVariation, variation_name: 'Updated Size' }),
    remove: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue([mockVariation]),
    findByBarcode: jest.fn().mockResolvedValue(mockVariation),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariationController],
      providers: [
        {
          provide: ProductVariationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductVariationController>(ProductVariationController);
    service = module.get<ProductVariationService>(ProductVariationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create a product variation', async () => {
      const dto: CreateProductVariationDto = { variation_name: 'Size M' } as any;
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockVariation);
    });
  });

  describe('findAll()', () => {
    it('should return all product variations', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockVariation]);
    });
  });

  describe('findOne()', () => {
    it('should return one product variation by id', async () => {
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockVariation);
    });
  });

  describe('update()', () => {
    it('should update a product variation', async () => {
      const dto: UpdateProductVariationDto = { variation_name: 'Updated Size' } as any;
      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ ...mockVariation, variation_name: 'Updated Size' });
    });
  });

  describe('remove()', () => {
    it('should remove a product variation', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findByName()', () => {
    it('should return variations by name', async () => {
      const result = await controller.findByName('Size M');
      expect(service.findByName).toHaveBeenCalledWith('Size M');
      expect(result).toEqual([mockVariation]);
    });
  });

  describe('findByBarcode()', () => {
    it('should return variation by barcode', async () => {
      const result = await controller.findByBarcode('123456789');
      expect(service.findByBarcode).toHaveBeenCalledWith('123456789');
      expect(result).toEqual(mockVariation);
    });
  });
});
