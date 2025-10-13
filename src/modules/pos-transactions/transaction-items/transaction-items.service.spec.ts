import { Test, TestingModule } from '@nestjs/testing';
import { TransactionItemsService } from './transaction-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionItem } from './transaction-item.entity';
import { Repository } from 'typeorm';
import { TransactionsService } from '../transactions/transactions.service';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { ConsignorService } from '../../inventory/consignor/consignor.service';
import { NotFoundException } from '@nestjs/common';

describe('TransactionItemsService', () => {
  let service: TransactionItemsService;
  let repo: Repository<TransactionItem>;

  // ✅ Mock repository methods
  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  // ✅ Mock dependencies
  const mockTransactionService = { findOne: jest.fn() };
  const mockProductService = { findOne: jest.fn() };
  const mockVariationService = { findOne: jest.fn() };
  const mockConsignorService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionItemsService,
        { provide: getRepositoryToken(TransactionItem), useValue: mockRepo },
        { provide: TransactionsService, useValue: mockTransactionService },
        { provide: ProductService, useValue: mockProductService },
        { provide: ProductVariationService, useValue: mockVariationService },
        { provide: ConsignorService, useValue: mockConsignorService },
      ],
    }).compile();

    service = module.get<TransactionItemsService>(TransactionItemsService);
    repo = module.get<Repository<TransactionItem>>(getRepositoryToken(TransactionItem));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    const dto = {
      transaction_id: 1,
      product_id: 2,
      variation_id: 3,
      consignor_id: 4,
      quantity: 2,
      unit_price: 100,
      discount_amount: 10,
      line_total: 190,
    };

    it('should throw NotFoundException if transaction not found', async () => {
      mockTransactionService.findOne.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should create and save a transaction item successfully', async () => {
      mockTransactionService.findOne.mockResolvedValue({ id: 1 });
      mockProductService.findOne.mockResolvedValue({ id: 2 });
      mockVariationService.findOne.mockResolvedValue({ id: 3 });
      mockConsignorService.findOne.mockResolvedValue({ id: 4 });
      mockRepo.create.mockReturnValue(dto);
      mockRepo.save.mockResolvedValue({ item_id: 1, ...dto });

      const result = await service.create(dto);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result.item_id).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return all transaction items', async () => {
      const mockItems = [{ item_id: 1 }];
      mockRepo.find.mockResolvedValue(mockItems);

      const result = await service.findAll();
      expect(mockRepo.find).toHaveBeenCalledWith({
        relations: ['transaction', 'product', 'variation', 'consignor'],
      });
      expect(result).toEqual(mockItems);
    });
  });

  describe('findOne', () => {
    it('should return one transaction item', async () => {
      const mockItem = { item_id: 1 };
      mockRepo.findOne.mockResolvedValue(mockItem);

      const result = await service.findOne(1);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { item_id: 1 },
        relations: ['transaction', 'product', 'variation', 'consignor'],
      });
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if item not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
