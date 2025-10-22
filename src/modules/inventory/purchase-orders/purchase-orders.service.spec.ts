import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrdersService } from './purchase-orders.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PurchaseOrder, PurchaseOrderStatus } from './purchase-order.entity';
import { ShopService } from '../../shop/shop.service';
import { SupplierService } from '../supplier/supplier.service';
import { UsersService } from '../../users/users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

describe('PurchaseOrdersService', () => {
  let service: PurchaseOrdersService;
  let repo: Repository<PurchaseOrder>;

  const mockRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockShopService = {
    findOne: jest.fn(),
  };

  const mockSupplierService = {
    findOne: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockPurchaseOrder: Partial<PurchaseOrder> = {
    po_id: 1,
    po_number: 'PO123',
    order_date: '2025-10-10',
    expected_delivery_date: '2025-10-20',
    total_amount: 1000,
    total_gst_amount: 100,
    status: PurchaseOrderStatus.DRAFT,
    is_gst_applicable: true,
    created_at: new Date(),
    updated_at: new Date(),
    shop: { id: 1 } as any,
    supplier: { id: 2 } as any,
    items: [],
    goods_received_notes: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseOrdersService,
        { provide: getRepositoryToken(PurchaseOrder), useValue: mockRepo },
        { provide: ShopService, useValue: mockShopService },
        { provide: SupplierService, useValue: mockSupplierService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<PurchaseOrdersService>(PurchaseOrdersService);
    repo = module.get<Repository<PurchaseOrder>>(getRepositoryToken(PurchaseOrder));
  });

  afterEach(() => jest.clearAllMocks());

  // ---------------------------
  // CREATE
  // ---------------------------
  describe('create', () => {
    it('should throw ConflictException if PO number already exists', async () => {
      mockRepo.findOne.mockResolvedValue(mockPurchaseOrder);

      const dto: CreatePurchaseOrderDto = {
        po_number: 'PO123',
        shop_id: 1,
        supplier_id: 2,
        order_date: '2025-10-10',
      } as any;

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if shop not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockShopService.findOne.mockResolvedValue(null);

      const dto: CreatePurchaseOrderDto = {
        po_number: 'PO999',
        shop_id: 1,
        supplier_id: 2,
        order_date: '2025-10-10',
      } as any;

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should create and return a new purchase order', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockShopService.findOne.mockResolvedValue({ id: 1 });
      mockSupplierService.findOne.mockResolvedValue({ id: 2 });
      mockRepo.create.mockReturnValue(mockPurchaseOrder);
      mockRepo.save.mockResolvedValue(mockPurchaseOrder);

      const dto: CreatePurchaseOrderDto = {
        po_number: 'PO999',
        shop_id: 1,
        supplier_id: 2,
        order_date: '2025-10-10',
      } as any;

      const result = await service.create(dto);
      expect(result).toEqual(mockPurchaseOrder);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  // ---------------------------
  // FIND ALL
  // ---------------------------
  describe('findAll', () => {
    it('should return all purchase orders', async () => {
      mockRepo.find.mockResolvedValue([mockPurchaseOrder]);
      const result = await service.findAll();
      expect(result).toEqual([mockPurchaseOrder]);
    });
  });

  // ---------------------------
  // FIND ONE
  // ---------------------------
  describe('findOne', () => {
    it('should return a purchase order by ID', async () => {
      mockRepo.findOne.mockResolvedValue(mockPurchaseOrder);
      const result = await service.findOne(1);
      expect(result).toEqual(mockPurchaseOrder);
    });

    it('should throw NotFoundException if PO not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------
  // UPDATE
  // ---------------------------
  describe('update', () => {
    it('should update and return a purchase order', async () => {
      mockRepo.findOne.mockResolvedValue(mockPurchaseOrder);
      mockRepo.save.mockResolvedValue(mockPurchaseOrder);

      const dto: UpdatePurchaseOrderDto = {
        status: PurchaseOrderStatus.APPROVED,
      };

      const result = await service.update(1, dto);
      expect(result).toEqual(mockPurchaseOrder);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  // ---------------------------
  // REMOVE
  // ---------------------------
  describe('remove', () => {
    it('should delete a purchase order', async () => {
      mockRepo.findOne.mockResolvedValue(mockPurchaseOrder);
      mockRepo.remove.mockResolvedValue(undefined);
      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException if PO does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------
  // FIND BY PO NUMBER
  // ---------------------------
  describe('findByPoNumber', () => {
    it('should return a purchase order by PO number', async () => {
      mockRepo.findOne.mockResolvedValue(mockPurchaseOrder);
      const result = await service.findByPoNumber('PO123');
      expect(result).toEqual(mockPurchaseOrder);
    });

    it('should throw NotFoundException if PO not found by number', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findByPoNumber('PO999')).rejects.toThrow(NotFoundException);
    });
  });
});
