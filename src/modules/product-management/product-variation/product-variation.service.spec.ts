import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductVariationService } from './product-variation.service';
import { ProductVariation } from './product-variation.entity';
import { ProductService } from '../product/product.service';

describe('ProductVariationService', () => {
  let service: ProductVariationService;

  const mockVariationRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  const mockProductService = {
    findOne: jest.fn(),
  };

  const sampleVariation = {
    variation_id: 1,
    variation_name: 'Red',
    variation_code: 'RED001',
    price_adjustment: 0,
    cost_adjustment: 0,
    stock_quantity: 10,
    is_active: true,
    product: { product_id: 1 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductVariationService,
        {
          provide: getRepositoryToken(ProductVariation),
          useValue: mockVariationRepo,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    service = module.get<ProductVariationService>(ProductVariationService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw conflict if variation_code exists', async () => {
      mockVariationRepo.findOne.mockResolvedValue(sampleVariation);
      await expect(
        service.create({ ...sampleVariation, product_id: 1 }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create and save a variation', async () => {
      mockVariationRepo.findOne.mockResolvedValue(undefined);
      mockProductService.findOne.mockResolvedValue({ product_id: 1 });
      mockVariationRepo.create.mockReturnValue(sampleVariation);
      mockVariationRepo.save.mockResolvedValue(sampleVariation);

      const result = await service.create({ ...sampleVariation, product_id: 1 });
      expect(result).toEqual(sampleVariation);
      expect(mockVariationRepo.save).toHaveBeenCalledWith(sampleVariation);
    });
  });

  describe('findAll', () => {
    it('should return all variations', async () => {
      mockVariationRepo.find.mockResolvedValue([sampleVariation]);
      const result = await service.findAll();
      expect(result).toEqual([sampleVariation]);
    });
  });

  describe('findOne', () => {
    it('should throw not found if missing', async () => {
      mockVariationRepo.findOne.mockResolvedValue(undefined);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return a variation', async () => {
      mockVariationRepo.findOne.mockResolvedValue(sampleVariation);
      const result = await service.findOne(1);
      expect(result).toEqual(sampleVariation);
    });
  });

  describe('update', () => {
    it('should throw conflict if variation_code exists', async () => {
      mockVariationRepo.findOne
        .mockResolvedValueOnce(sampleVariation) // findOne for existing variation
        .mockResolvedValueOnce({ variation_code: 'RED002' }); // findOne for new code check

      await expect(
        service.update(1, { variation_code: 'RED002' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should update variation', async () => {
      mockVariationRepo.findOne.mockResolvedValue(sampleVariation);
      mockProductService.findOne.mockResolvedValue({ product_id: 1 });
      mockVariationRepo.save.mockResolvedValue(sampleVariation);

      const result = await service.update(1, { variation_name: 'Blue' });
      expect(result).toEqual(sampleVariation);
      expect(mockVariationRepo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove variation', async () => {
      mockVariationRepo.findOne.mockResolvedValue(sampleVariation);
      mockVariationRepo.remove.mockResolvedValue(undefined);
      await service.remove(1);
      expect(mockVariationRepo.remove).toHaveBeenCalledWith(sampleVariation);
    });
  });

  describe('findByName', () => {
    it('should search variations by name', async () => {
      mockVariationRepo.find.mockResolvedValue([sampleVariation]);
      const result = await service.findByName('Red');
      expect(result).toEqual([sampleVariation]);
    });
  });

  describe('findByBarcode', () => {
    it('should throw not found if missing', async () => {
      mockVariationRepo.findOne.mockResolvedValue(undefined);
      await expect(service.findByBarcode('BAR123')).rejects.toThrow(NotFoundException);
    });

    it('should return variation by barcode', async () => {
      mockVariationRepo.findOne.mockResolvedValue(sampleVariation);
      const result = await service.findByBarcode('BAR123');
      expect(result).toEqual(sampleVariation);
    });
  });
});
