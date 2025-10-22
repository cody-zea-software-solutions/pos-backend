import { Test, TestingModule } from '@nestjs/testing';
import { GoodsReceivedNotesService } from './goods-received-notes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GoodsReceivedNote, GrnStatus } from './goods-received-note.entity';
import { Repository } from 'typeorm';
import { ShopService } from '../../shop/shop.service';
import { SupplierService } from '../supplier/supplier.service';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { UsersService } from '../../users/users.service';
import { SupplierOutstandingsService } from '../supplier-outstandings/supplier-outstandings.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('GoodsReceivedNotesService', () => {
  let service: GoodsReceivedNotesService;
  let repo: Repository<GoodsReceivedNote>;

  const mockRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  const mockShopService = { findOne: jest.fn() };
  const mockSupplierService = {
    findOne: jest.fn(),
    updateOutstandingAfterGrn: jest.fn(),
  };
  const mockPoService = { findOne: jest.fn() };
  const mockUserService = { findOne: jest.fn() };
  const mockOutstandingsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoodsReceivedNotesService,
        { provide: getRepositoryToken(GoodsReceivedNote), useValue: mockRepo },
        { provide: ShopService, useValue: mockShopService },
        { provide: SupplierService, useValue: mockSupplierService },
        { provide: PurchaseOrdersService, useValue: mockPoService },
        { provide: UsersService, useValue: mockUserService },
        { provide: SupplierOutstandingsService, useValue: mockOutstandingsService },
      ],
    }).compile();

    service = module.get<GoodsReceivedNotesService>(GoodsReceivedNotesService);
    repo = module.get<Repository<GoodsReceivedNote>>(getRepositoryToken(GoodsReceivedNote));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should throw ConflictException if GRN number already exists', async () => {
      mockRepo.findOne.mockResolvedValue({ grn_number: 'GRN001' });

      await expect(
        service.create({ grn_number: 'GRN001', shop_id: 1, supplier_id: 1 } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if shop not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockShopService.findOne.mockResolvedValue(null);

      await expect(
        service.create({ grn_number: 'GRN001', shop_id: 1, supplier_id: 1 } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create and return a GRN successfully', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockShopService.findOne.mockResolvedValue({ shop_id: 1 });
      mockSupplierService.findOne.mockResolvedValue({ supplier_id: 1 });
      mockRepo.create.mockReturnValue({ grn_number: 'GRN001' });
      mockRepo.save.mockResolvedValue({ grn_id: 1, grn_number: 'GRN001' });
      mockOutstandingsService.create.mockResolvedValue({ balance_amount: 100 });

      const result = await service.create({
        grn_number: 'GRN001',
        shop_id: 1,
        supplier_id: 1,
      } as any);

      expect(result.grn_number).toBe('GRN001');
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all GRNs', async () => {
      mockRepo.find.mockResolvedValue([{ grn_id: 1 }]);
      const result = await service.findAll();
      expect(result).toEqual([{ grn_id: 1 }]);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if GRN not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return a GRN', async () => {
      mockRepo.findOne.mockResolvedValue({ grn_id: 1 });
      const result = await service.findOne(1);
      expect(result.grn_id).toBe(1);
    });
  });

  describe('remove', () => {
    it('should remove a GRN', async () => {
      const grn = { grn_id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(grn as any);
      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalledWith(grn);
    });
  });
});
