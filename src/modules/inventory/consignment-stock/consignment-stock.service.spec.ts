import { Test, TestingModule } from '@nestjs/testing';
import { ConsignmentStockService } from './consignment-stock.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConsignmentStock } from './consignment-stock.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { ConsignorService } from '../consignor/consignor.service';
import { ShopService } from '../../shop/shop.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ConsignmentStockService', () => {
  let service: ConsignmentStockService;
  let repo: Repository<ConsignmentStock>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockProductService = { findOne: jest.fn() };
  const mockVariationService = { findOne: jest.fn() };
  const mockConsignorService = { findOne: jest.fn() };
  const mockShopService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsignmentStockService,
        { provide: getRepositoryToken(ConsignmentStock), useValue: mockRepo },
        { provide: ProductService, useValue: mockProductService },
        { provide: ProductVariationService, useValue: mockVariationService },
        { provide: ConsignorService, useValue: mockConsignorService },
        { provide: ShopService, useValue: mockShopService },
      ],
    }).compile();

    service = module.get<ConsignmentStockService>(ConsignmentStockService);
    repo = module.get<Repository<ConsignmentStock>>(getRepositoryToken(ConsignmentStock));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    const dto = {
      product_id: 1,
      consignor_id: 2,
      shop_id: 3,
      quantity_received: 10,
      consignor_price: 100,
      selling_price: 150,
    };

    it('should create a new consignment', async () => {
      mockProductService.findOne.mockResolvedValue({ id: 1 });
      mockConsignorService.findOne.mockResolvedValue({ id: 2 });
      mockShopService.findOne.mockResolvedValue({ id: 3 });
      mockRepo.create.mockReturnValue(dto);
      mockRepo.save.mockResolvedValue({ consignment_id: 1, ...dto });

      const result = await service.create(dto as any);
      expect(result).toHaveProperty('consignment_id');
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid product', async () => {
      mockProductService.findOne.mockResolvedValue(null);
      await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll()', () => {
    it('should return an array of consignments', async () => {
      const mockData = [{ consignment_id: 1 }];
      mockRepo.find.mockResolvedValue(mockData);
      const result = await service.findAll();
      expect(result).toEqual(mockData);
    });
  });

  describe('findOne()', () => {
    it('should return a single consignment', async () => {
      const mockData = { consignment_id: 1 };
      mockRepo.findOne.mockResolvedValue(mockData);
      const result = await service.findOne(1);
      expect(result).toEqual(mockData);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update an existing consignment', async () => {
      const existing = { consignment_id: 1, quantity_received: 10, quantity_sold: 0 };
      const dto = { quantity_sold: 5 };
      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.save.mockResolvedValue({ ...existing, ...dto });

      const result = await service.update(1, dto as any);
      expect(result.quantity_sold).toBe(5);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if record not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('should remove consignment', async () => {
      mockRepo.findOne.mockResolvedValue({ consignment_id: 1 });
      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
