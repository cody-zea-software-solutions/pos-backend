import { Test, TestingModule } from '@nestjs/testing';
import { RefundItemsService } from './refund-items.service';
import { RefundItem } from './refund-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefundService } from '../refund/refund.service';
import { TransactionItemsService } from '../../pos-transactions/transaction-items/transaction-items.service';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { ConsignorService } from '../../inventory/consignor/consignor.service';
import { NotFoundException } from '@nestjs/common';

const mockRefundItem: Partial<RefundItem> = {
  refund_item_id: 1,
  quantity_refunded: 2,
  unit_price: 50,
  refund_amount: 100,
  condition: 'NEW' as any,
  restock_action: 'RESTOCK' as any,
};

describe('RefundItemsService', () => {
  let service: RefundItemsService;
  let repo: Repository<RefundItem>;

  const mockRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockRefundService = { findOne: jest.fn() };
  const mockTrxItemService = { findOne: jest.fn() };
  const mockProductService = { findOne: jest.fn() };
  const mockVariationService = { findOne: jest.fn() };
  const mockConsignorService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefundItemsService,
        { provide: getRepositoryToken(RefundItem), useValue: mockRepo },
        { provide: RefundService, useValue: mockRefundService },
        { provide: TransactionItemsService, useValue: mockTrxItemService },
        { provide: ProductService, useValue: mockProductService },
        { provide: ProductVariationService, useValue: mockVariationService },
        { provide: ConsignorService, useValue: mockConsignorService },
      ],
    }).compile();

    service = module.get<RefundItemsService>(RefundItemsService);
    repo = module.get<Repository<RefundItem>>(getRepositoryToken(RefundItem));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw NotFoundException if refund not found', async () => {
      mockRefundService.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          refund_id: 99,
          quantity_refunded: 1,
          unit_price: 20,
          refund_amount: 20,
          condition: 'NEW' as any,
          restock_action: 'RESTOCK' as any,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create and save refund item successfully', async () => {
      mockRefundService.findOne.mockResolvedValue({ id: 1 });
      mockTrxItemService.findOne.mockResolvedValue(null);
      mockProductService.findOne.mockResolvedValue(null);
      mockVariationService.findOne.mockResolvedValue(null);
      mockConsignorService.findOne.mockResolvedValue(null);

      mockRepo.create.mockReturnValue(mockRefundItem);
      mockRepo.save.mockResolvedValue(mockRefundItem);

      const dto = {
        refund_id: 1,
        quantity_refunded: 2,
        unit_price: 50,
        refund_amount: 100,
        condition: 'NEW' as any,
        restock_action: 'RESTOCK' as any,
      };

      const result = await service.create(dto);

      expect(result).toEqual(mockRefundItem);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all refund items', async () => {
      mockRepo.find.mockResolvedValue([mockRefundItem]);

      const result = await service.findAll();
      expect(result).toEqual([mockRefundItem]);
    });
  });

  describe('findOne', () => {
    it('should return one refund item', async () => {
      mockRepo.findOne.mockResolvedValue(mockRefundItem);

      const result = await service.findOne(1);
      expect(result).toEqual(mockRefundItem);
    });

    it('should throw NotFoundException if item not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });
});
