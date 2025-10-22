import { Test, TestingModule } from '@nestjs/testing';
import { SupplierOutstandingsService } from './supplier-outstandings.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupplierOutstanding } from './supplier-outstanding.entity';
import { ShopService } from '../../shop/shop.service';
import { SupplierService } from '../supplier/supplier.service';
import { GoodsReceivedNotesService } from '../goods-received-notes/goods-received-notes.service';
import { NotFoundException } from '@nestjs/common';
import { CreateSupplierOutstandingDto } from './dto/create-supplier-outstanding.dto';
import { UpdateSupplierOutstandingDto } from './dto/update-supplier-outstanding.dto';
import { SupplierOutstandingStatus } from './supplier-outstanding.entity';

describe('SupplierOutstandingsService', () => {
  let service: SupplierOutstandingsService;
  let repo: Repository<SupplierOutstanding>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockShopService = { findOne: jest.fn() };
  const mockSupplierService = { findOne: jest.fn() };
  const mockGrnService = { findOne: jest.fn() };

  const mockOutstanding: Partial<SupplierOutstanding> = {
    outstanding_id: 1,
    total_amount: 1000,
    paid_amount: 200,
    balance_amount: 800,
    status: SupplierOutstandingStatus.PENDING,
    shop: { id: 1 } as any,
    supplier: { id: 2 } as any,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierOutstandingsService,
        { provide: getRepositoryToken(SupplierOutstanding), useValue: mockRepo },
        { provide: ShopService, useValue: mockShopService },
        { provide: SupplierService, useValue: mockSupplierService },
        { provide: GoodsReceivedNotesService, useValue: mockGrnService },
      ],
    }).compile();

    service = module.get<SupplierOutstandingsService>(SupplierOutstandingsService);
    repo = module.get<Repository<SupplierOutstanding>>(getRepositoryToken(SupplierOutstanding));
  });

  afterEach(() => jest.clearAllMocks());

  // ---------------------------
  // CREATE
  // ---------------------------
  describe('create', () => {
    it('should create and return a new supplier outstanding', async () => {
      mockShopService.findOne.mockResolvedValue({ id: 1 });
      mockSupplierService.findOne.mockResolvedValue({ id: 2 });
      mockGrnService.findOne.mockResolvedValue({ id: 3 });
      mockRepo.create.mockReturnValue(mockOutstanding);
      mockRepo.save.mockResolvedValue(mockOutstanding);

      const dto: CreateSupplierOutstandingDto = {
        shop_id: 1,
        supplier_id: 2,
        grn_id: 3,
        total_amount: 1000,
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockOutstanding);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  // ---------------------------
  // FIND ALL
  // ---------------------------
  describe('findAll', () => {
    it('should return all outstandings', async () => {
      mockRepo.find.mockResolvedValue([mockOutstanding]);
      const result = await service.findAll();
      expect(result).toEqual([mockOutstanding]);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  // ---------------------------
  // FIND ONE
  // ---------------------------
  describe('findOne', () => {
    it('should return a supplier outstanding by ID', async () => {
      mockRepo.findOne.mockResolvedValue(mockOutstanding);
      const result = await service.findOne(1);
      expect(result).toEqual(mockOutstanding);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------
  // UPDATE
  // ---------------------------
  describe('update', () => {
    it('should update and return the updated outstanding', async () => {
      mockRepo.findOne.mockResolvedValue(mockOutstanding);
      mockRepo.save.mockResolvedValue(mockOutstanding);

      const dto: UpdateSupplierOutstandingDto = {
        paid_amount: 500,
        status: SupplierOutstandingStatus.PARTIAL,
      };

      const result = await service.update(1, dto);
      expect(result).toEqual(mockOutstanding);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  // ---------------------------
  // REMOVE
  // ---------------------------
  describe('remove', () => {
    it('should remove an outstanding', async () => {
      mockRepo.findOne.mockResolvedValue(mockOutstanding);
      mockRepo.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------
  // FIND BY SUPPLIER
  // ---------------------------
  describe('findBySupplier', () => {
    it('should return all outstandings for a supplier', async () => {
      mockSupplierService.findOne.mockResolvedValue({ id: 2 });
      mockRepo.find.mockResolvedValue([mockOutstanding]);
      const result = await service.findBySupplier(2);
      expect(result).toEqual([mockOutstanding]);
    });
  });
});
