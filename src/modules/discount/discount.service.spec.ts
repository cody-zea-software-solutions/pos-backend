import { Test, TestingModule } from '@nestjs/testing';
import { DiscountService } from './discount.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Discount } from './discount.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product-management/product/product.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

describe('DiscountService', () => {
  let service: DiscountService;
  let repo: jest.Mocked<Repository<Discount>>;
  let mockProductService: { findOne: jest.Mock };

  const mockDiscount: Discount = {
    discount_id: 1,
    discount_code: 'DISC10',
    discount_type: 'PERCENTAGE',
    discount_value: 10,
    is_active: true,
    target_product: { product_id: 1, product_name: 'Laptop' } as any,
    created_at: new Date(),
  } as any;

  beforeEach(async () => {
    mockProductService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountService,
        { provide: getRepositoryToken(Discount), useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compile();

    service = module.get<DiscountService>(DiscountService);
    repo = module.get(getRepositoryToken(Discount));
  });

  afterEach(() => jest.clearAllMocks());

  // ──────────────────────────────
  describe('create', () => {
    const dto: CreateDiscountDto = {
      discount_code: 'DISC10',
      discount_type: 'PERCENTAGE',
      discount_value: 10,
      target_id: 1,
    } as any;

    it('should throw ConflictException if discount code exists', async () => {
      repo.findOne.mockResolvedValue(mockDiscount);
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(repo.findOne).toHaveBeenCalled();
    });

    it('should create and save discount successfully (with target)', async () => {
      repo.findOne.mockResolvedValue(null);
      mockProductService.findOne.mockResolvedValue({ product_id: 1, product_name: 'Laptop' });
      repo.create.mockReturnValue(mockDiscount as any);
repo.save.mockResolvedValue(mockDiscount as any);


      const result = await service.create(dto);
      expect(result).toEqual(mockDiscount);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(mockProductService.findOne).toHaveBeenCalledWith(1);
    });

   it('should create discount without target product', async () => {
  const dtoNoTarget: CreateDiscountDto = { ...dto, target_id: undefined };
  repo.findOne.mockResolvedValue(null);
  mockProductService.findOne.mockResolvedValue(null);
  repo.create.mockReturnValue(dtoNoTarget as any);
  repo.save.mockResolvedValue(mockDiscount);

  const result = await service.create(dtoNoTarget);
  expect(result).toEqual(mockDiscount);
  expect(mockProductService.findOne).not.toHaveBeenCalled();
});
  });

  // ──────────────────────────────
  describe('findAll', () => {
    it('should return all discounts', async () => {
      repo.find.mockResolvedValue([mockDiscount]);
      const result = await service.findAll();
      expect(result).toEqual([mockDiscount]);
      expect(repo.find).toHaveBeenCalledWith({
        relations: ['target_product'],
        order: { created_at: 'DESC' },
      });
    });
  });

  // ──────────────────────────────
  describe('findOne', () => {
    it('should return a discount if found', async () => {
      repo.findOne.mockResolvedValue(mockDiscount);
      const result = await service.findOne(1);
      expect(result).toEqual(mockDiscount);
      expect(repo.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ──────────────────────────────
  describe('update', () => {
    const updateDto: UpdateDiscountDto = {
      discount_code: 'DISC20',
      discount_value: 20,
      target_id: 2,
    } as any;

    it('should throw ConflictException if discount_code exists', async () => {
      repo.findOne
        .mockResolvedValueOnce(mockDiscount) // existing discount to update
        .mockResolvedValueOnce(mockDiscount); // duplicate code

      await expect(service.update(1, updateDto)).rejects.toThrow(ConflictException);
    });

    it('should update and save successfully', async () => {
      repo.findOne
        .mockResolvedValueOnce(mockDiscount) // existing discount
        .mockResolvedValueOnce(null); // no duplicate
      mockProductService.findOne.mockResolvedValue({ product_id: 2, product_name: 'Mouse' });
      repo.save.mockResolvedValue({ ...mockDiscount, discount_code: 'DISC20' });

      const result = await service.update(1, updateDto);
      expect(result.discount_code).toBe('DISC20');
      expect(repo.save).toHaveBeenCalled();
      expect(mockProductService.findOne).toHaveBeenCalledWith(2);
    });
  });

  // ──────────────────────────────
  describe('remove', () => {
    it('should remove discount successfully', async () => {
      repo.findOne.mockResolvedValue(mockDiscount);
      repo.remove.mockResolvedValue(mockDiscount);

      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockDiscount);
    });

    it('should throw NotFoundException if discount not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
