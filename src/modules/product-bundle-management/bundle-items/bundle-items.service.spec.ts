import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BundleItemsService } from './bundle-items.service';
import { BundleItem, BundleItemType } from './bundle-item.entity';
import { ProductBundlesService } from '../product-bundles/product-bundles.service';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { ServicesService } from '../../service-management/services/services.service';
import { NotFoundException } from '@nestjs/common';

describe('BundleItemsService', () => {
  let service: BundleItemsService;
  let repo: Repository<BundleItem>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockBundleService = { findOne: jest.fn() };
  const mockProductService = { findOne: jest.fn() };
  const mockVariationService = { findOne: jest.fn() };
  const mockServiceService = { findOne: jest.fn() };

  const mockBundleItem: BundleItem = {
    bundle_item_id: 1,
    bundle: { bundle_id: 1 } as any,
    item_type: BundleItemType.PRODUCT,
    quantity: 2,
    minimum_quantity: 1,
    maximum_quantity:0,
    is_mandatory: false,
    allow_substitution: false,
    individual_price: 100,
    bundle_price: 90,
    discount_amount: 10,
    sort_order: 1,
    is_active: true,
    substitution_rules: '',
    item_notes: '',
    created_at: new Date(),
    product: undefined,
    variation: undefined,
    service: undefined,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BundleItemsService,
        { provide: getRepositoryToken(BundleItem), useValue: mockRepo },
        { provide: ProductBundlesService, useValue: mockBundleService },
        { provide: ProductService, useValue: mockProductService },
        { provide: ProductVariationService, useValue: mockVariationService },
        { provide: ServicesService, useValue: mockServiceService },
      ],
    }).compile();

    service = module.get<BundleItemsService>(BundleItemsService);
    repo = module.get<Repository<BundleItem>>(getRepositoryToken(BundleItem));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all bundle items', async () => {
      mockRepo.find.mockResolvedValue([mockBundleItem]);
      const result = await service.findAll();
      expect(result).toEqual([mockBundleItem]);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a bundle item', async () => {
      mockRepo.findOne.mockResolvedValue(mockBundleItem);
      const result = await service.findOne(1);
      expect(result).toEqual(mockBundleItem);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a bundle item', async () => {
      mockBundleService.findOne.mockResolvedValue({ id: 1 });
      mockRepo.create.mockReturnValue(mockBundleItem);
      mockRepo.save.mockResolvedValue(mockBundleItem);

      const dto = {
        bundle_id: 1,
        item_type: BundleItemType.PRODUCT,
        quantity: 2,
      };

      const result = await service.create(dto as any);
      expect(result).toEqual(mockBundleItem);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if bundle not found', async () => {
      mockBundleService.findOne.mockResolvedValue(null);
      await expect(
        service.create({ bundle_id: 999, item_type: BundleItemType.PRODUCT, quantity: 1 } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a bundle item', async () => {
      mockRepo.findOne.mockResolvedValue(mockBundleItem);
      mockRepo.save.mockResolvedValue({ ...mockBundleItem, quantity: 5 });

      const result = await service.update(1, { quantity: 5 });
      expect(result.quantity).toBe(5);
    });
  });

  describe('remove', () => {
    it('should remove a bundle item', async () => {
      mockRepo.findOne.mockResolvedValue(mockBundleItem);
      mockRepo.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalledWith(mockBundleItem);
    });
  });
});
