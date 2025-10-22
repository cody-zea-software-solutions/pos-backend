import { Test, TestingModule } from '@nestjs/testing';
import { GrnItemsService } from './grn-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GRNItem } from './grn-item.entity';
import { GoodsReceivedNotesService } from '../goods-received-notes/goods-received-notes.service';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('GrnItemsService', () => {
  let service: GrnItemsService;
  let repo: Repository<GRNItem>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockGrnService = {
    findOne: jest.fn(),
    findByGrnNumber: jest.fn(),
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
        GrnItemsService,
        { provide: getRepositoryToken(GRNItem), useValue: mockRepo },
        { provide: GoodsReceivedNotesService, useValue: mockGrnService },
        { provide: ProductService, useValue: mockProductService },
        { provide: ProductVariationService, useValue: mockVariationService },
      ],
    }).compile();

    service = module.get<GrnItemsService>(GrnItemsService);
    repo = module.get<Repository<GRNItem>>(getRepositoryToken(GRNItem));
  });

  afterEach(() => jest.clearAllMocks());

  // -----------------------
  // CREATE
  // -----------------------
  describe('create()', () => {
    const dtoBase = {
      grn_id: 1,
      unit_cost: 50,
      quantity_accepted: 2,
      total_cost: 100,
    };

    it('should create and save GRNItem successfully (with product and variation)', async () => {
      mockGrnService.findOne.mockResolvedValue({ grn_id: 1 });
      mockProductService.findOne.mockResolvedValue({ id: 1 });
      mockVariationService.findOne.mockResolvedValue({ id: 2 });
      mockRepo.create.mockReturnValue({ ...dtoBase });
      mockRepo.save.mockResolvedValue({ id: 10, ...dtoBase });

      const result = await service.create({
        ...dtoBase,
        product_id: 1,
        variation_id: 2,
      } as any);

      expect(result).toEqual({ id: 10, ...dtoBase });
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when GRN is not found', async () => {
      mockGrnService.findOne.mockResolvedValue(null);

      await expect(service.create(dtoBase as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if total_cost mismatch', async () => {
      mockGrnService.findOne.mockResolvedValue({ grn_id: 1 });

      await expect(
        service.create({ ...dtoBase, total_cost: 999 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle null product_id and variation_id gracefully', async () => {
      mockGrnService.findOne.mockResolvedValue({ grn_id: 1 });
      mockRepo.create.mockReturnValue(dtoBase);
      mockRepo.save.mockResolvedValue(dtoBase);

      const result = await service.create(dtoBase as any);
      expect(result).toEqual(dtoBase);
    });
  });

  // -----------------------
  // FIND ALL
  // -----------------------
  describe('findAll()', () => {
    it('should return all items', async () => {
      mockRepo.find.mockResolvedValue(['item1', 'item2']);
      const result = await service.findAll();
      expect(result).toEqual(['item1', 'item2']);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  // -----------------------
  // FIND ONE
  // -----------------------
  describe('findOne()', () => {
    it('should return a GRN item', async () => {
      const item = { grn_item_id: 1 };
      mockRepo.findOne.mockResolvedValue(item);
      const result = await service.findOne(1);
      expect(result).toEqual(item);
    });

    it('should throw NotFoundException when item not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // -----------------------
  // UPDATE
  // -----------------------
  describe('update()', () => {
  it('should update an item successfully', async () => {
    // Arrange
    const mockItem = {
      id: 1,
      unit_cost: 100,
      quantity_accepted: 2,
      total_cost: 200,
    };

    mockRepo.findOne.mockResolvedValue(mockItem);
    mockRepo.save.mockImplementation(async (item) => item);

    // Act
    const dto = { quantity_accepted: 3, total_cost: 300 }; // 100 * 3 = 300
    const result = await service.update(1, dto);

    // Assert
    expect(result.total_cost).toBe(300);
    expect(result.quantity_accepted).toBe(3);
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('should throw BadRequestException for invalid total cost', async () => {
    const mockItem = {
      id: 1,
      unit_cost: 100,
      quantity_accepted: 2,
      total_cost: 200,
    };

    mockRepo.findOne.mockResolvedValue(mockItem);

    const invalidDto = { quantity_accepted: 3, total_cost: 200 }; // Invalid (should be 300)

    await expect(service.update(1, invalidDto)).rejects.toThrow(
      BadRequestException,
    );
  });
});

  // -----------------------
  // REMOVE
  // -----------------------
  describe('remove()', () => {
    it('should remove the GRN item', async () => {
      const item = { grn_item_id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(item as any);
      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalledWith(item);
    });
  });

  // -----------------------
  // FIND BY GRN
  // -----------------------
  describe('findByGrn()', () => {
    it('should return items filtered by grn_id', async () => {
      mockRepo.find.mockResolvedValue(['filtered']);
      const result = await service.findByGrn(1);
      expect(result).toEqual(['filtered']);
    });
  });

  // -----------------------
  // FIND BY GRN NUMBER
  // -----------------------
  describe('findByGrnNumber()', () => {
    it('should return items by grn number', async () => {
      mockGrnService.findByGrnNumber.mockResolvedValue({ grn_id: 5 });
      mockRepo.find.mockResolvedValue(['items']);
      const result = await service.findByGrnNumber('GRN-001');
      expect(result).toEqual(['items']);
    });

    it('should throw NotFoundException if GRN not found', async () => {
      mockGrnService.findByGrnNumber.mockResolvedValue(null);
      await expect(service.findByGrnNumber('UNKNOWN')).rejects.toThrow(NotFoundException);
    });
  });
});
