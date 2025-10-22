import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrderItemsService } from './purchase-order-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Repository } from 'typeorm';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PurchaseOrderItemsService', () => {
  let service: PurchaseOrderItemsService;
  let repo: Repository<PurchaseOrderItem>;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockPoService = {
    findOne: jest.fn(),
    findByPoNumber: jest.fn(),
  };

  const mockProductService = {
    findOne: jest.fn(),
  };

  const mockVariationService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseOrderItemsService,
        { provide: getRepositoryToken(PurchaseOrderItem), useValue: mockRepo },
        { provide: PurchaseOrdersService, useValue: mockPoService },
        { provide: ProductService, useValue: mockProductService },
        { provide: ProductVariationService, useValue: mockVariationService },
      ],
    }).compile();

    service = module.get<PurchaseOrderItemsService>(PurchaseOrderItemsService);
    repo = module.get<Repository<PurchaseOrderItem>>(getRepositoryToken(PurchaseOrderItem));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should throw NotFoundException if Purchase Order not found', async () => {
      mockPoService.findOne.mockResolvedValue(null);
      await expect(
        service.create({ po_id: 1, quantity_ordered: 2 } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if total_price mismatch', async () => {
      mockPoService.findOne.mockResolvedValue({ po_id: 1 });
      const dto = {
        po_id: 1,
        quantity_ordered: 2,
        unit_price: 100,
        total_price: 150,
      };
      await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
    });

    it('should create and return a PO item successfully', async () => {
      mockPoService.findOne.mockResolvedValue({ po_id: 1 });
      mockRepo.create.mockReturnValue({ quantity_ordered: 2 });
      mockRepo.save.mockResolvedValue({ po_item_id: 1 });

      const dto = {
        po_id: 1,
        quantity_ordered: 2,
        unit_price: 100,
        total_price: 200,
      };
      const result = await service.create(dto as any);
      expect(result).toEqual({ po_item_id: 1 });
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all PO items', async () => {
      mockRepo.find.mockResolvedValue([{ po_item_id: 1 }]);
      const result = await service.findAll();
      expect(result).toEqual([{ po_item_id: 1 }]);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return one PO item', async () => {
      mockRepo.findOne.mockResolvedValue({ po_item_id: 1 });
      const result = await service.findOne(1);
      expect(result.po_item_id).toBe(1);
    });
  });

  describe('update', () => {
    it('should throw BadRequestException for invalid total_price', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        po_item_id: 1,
        quantity_ordered: 2,
        unit_price: 100,
      } as any);

      const dto = { total_price: 150, unit_price: 100, quantity_ordered: 2 };
      await expect(service.update(1, dto as any)).rejects.toThrow(BadRequestException);
    });

    it('should update successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ po_item_id: 1 } as any);
      mockRepo.save.mockResolvedValue({ po_item_id: 1 });
      const dto = { quantity_ordered: 5 };
      const result = await service.update(1, dto as any);
      expect(result).toEqual({ po_item_id: 1 });
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      const item = { po_item_id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(item as any);
      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalledWith(item);
    });
  });

  describe('findByPurchaseOrder', () => {
    it('should return items for a given PO', async () => {
      mockRepo.find.mockResolvedValue([{ po_item_id: 1 }]);
      const result = await service.findByPurchaseOrder(1);
      expect(result).toEqual([{ po_item_id: 1 }]);
    });
  });

  describe('findByPoNumber', () => {
    it('should throw NotFoundException if PO not found', async () => {
      mockPoService.findByPoNumber.mockResolvedValue(null);
      await expect(service.findByPoNumber('PO001')).rejects.toThrow(NotFoundException);
    });

    it('should return items by PO number', async () => {
      mockPoService.findByPoNumber.mockResolvedValue({ po_id: 1 });
      mockRepo.find.mockResolvedValue([{ po_item_id: 1 }]);
      const result = await service.findByPoNumber('PO001');
      expect(result).toEqual([{ po_item_id: 1 }]);
    });
  });
});
