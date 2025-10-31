import { Test, TestingModule } from '@nestjs/testing';
import { ShopInventoryService } from './shop-inventory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ShopInventory } from './shop-inventory.entity';
import { ShopService } from '../../shop/shop.service';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { BatchesService } from '../batches/batches.service';
import { UsersService } from '../../users/users.service';
import { ConsignorService } from '../consignor/consignor.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ShopInventoryService', () => {
  let service: ShopInventoryService;
  let repo: Repository<ShopInventory>;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    findBy: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockShopService = { findOne: jest.fn() };
  const mockProductService = { findOne: jest.fn() };
  const mockVariationService = { findOne: jest.fn() };
  const mockBatchService = { findOne: jest.fn(), deductQuantity: jest.fn() };
  const mockUserService = { findOne: jest.fn() };
  const mockConsignorService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopInventoryService,
        { provide: getRepositoryToken(ShopInventory), useValue: mockRepo },
        { provide: ShopService, useValue: mockShopService },
        { provide: ProductService, useValue: mockProductService },
        { provide: ProductVariationService, useValue: mockVariationService },
        { provide: BatchesService, useValue: mockBatchService },
        { provide: UsersService, useValue: mockUserService },
        { provide: ConsignorService, useValue: mockConsignorService },
      ],
    }).compile();

    service = module.get<ShopInventoryService>(ShopInventoryService);
    repo = module.get<Repository<ShopInventory>>(getRepositoryToken(ShopInventory));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all inventory', async () => {
      const mockResult = [{ id: 1 }];
      mockRepo.find.mockResolvedValue(mockResult);
      const result = await service.findAll();
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return one inventory', async () => {
      const mockItem = { inventory_id: 1 };
      mockRepo.findOne.mockResolvedValue(mockItem);
      const result = await service.findOne(1);
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto = {
      shop_id: 1,
      product_id: 2,
      available_quantity: 10,
    };

    beforeEach(() => {
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue({});
      mockRepo.save.mockResolvedValue({ inventory_id: 1 });
      mockShopService.findOne.mockResolvedValue({});
      mockProductService.findOne.mockResolvedValue({});
    });

    it('should create inventory successfully', async () => {
      const result = await service.create(dto as any);
      expect(result).toHaveProperty('inventory_id');
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if record exists', async () => {
      mockRepo.findOne.mockResolvedValue({ inventory_id: 1 });
      await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
    });

    it('should create with optional relations', async () => {
      mockVariationService.findOne.mockResolvedValue({});
      mockBatchService.findOne.mockResolvedValue({});
      mockUserService.findOne.mockResolvedValue({});
      mockConsignorService.findOne.mockResolvedValue({});

      const fullDto = {
        ...dto,
        variation_id: 5,
        batch_id: 3,
        last_updated_by: 7,
        consignor_id: 4,
      };
      await service.create(fullDto as any);
      expect(mockVariationService.findOne).toHaveBeenCalled();
      expect(mockBatchService.findOne).toHaveBeenCalled();
      expect(mockUserService.findOne).toHaveBeenCalled();
      expect(mockConsignorService.findOne).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const dto = { available_quantity: 50 };
    it('should update successfully', async () => {
      const mockItem = { inventory_id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockItem as any);
      mockRepo.save.mockResolvedValue({ ...mockItem, ...dto });

      const result = await service.update(1, dto as any);
      expect(result).toEqual({ inventory_id: 1, available_quantity: 50 });
    });

    it('should update with optional fields', async () => {
      const mockItem = { inventory_id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockItem as any);
      mockShopService.findOne.mockResolvedValue({});
      mockProductService.findOne.mockResolvedValue({});
      mockVariationService.findOne.mockResolvedValue({});
      mockBatchService.findOne.mockResolvedValue({});
      mockUserService.findOne.mockResolvedValue({});
      mockConsignorService.findOne.mockResolvedValue({});

      const dto = {
        shop_id: 1,
        product_id: 1,
        variation_id: 1,
        batch_id: 1,
        last_updated_by: 1,
        consignor_id: 1,
      };
      await service.update(1, dto as any);
      expect(mockShopService.findOne).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove successfully', async () => {
      const mockItem = { inventory_id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockItem as any);
      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalledWith(mockItem);
    });
  });

  describe('findByProductAndVariation', () => {
    it('should handle variation and no-variation queries', async () => {
      const qb: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({}),
      };
      mockRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findByProductAndVariation(1, 1, 2);
      expect(qb.andWhere).toHaveBeenCalledWith(
        'variation.variation_id = :variationId',
        { variationId: 2 },
      );

      await service.findByProductAndVariation(1, 1, null);
      expect(qb.andWhere).toHaveBeenCalledWith('inventory.variation IS NULL');
    });
  });

  describe('deductStock', () => {
    const mockBatch = { batch_id: 1, received_date: '2024-01-01' };

    it('should do nothing if quantity <= 0', async () => {
      await expect(service.deductStock(1, 1, null, 0)).resolves.not.toThrow();
    });

    it('should throw NotFoundException when no inventories', async () => {
      mockRepo.find.mockResolvedValue([]);
      await expect(service.deductStock(1, 1, null, 10)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should deduct available quantity successfully', async () => {
      const inv = { available_quantity: 10, batch: mockBatch };
      mockRepo.find.mockResolvedValue([inv]);
      mockRepo.save.mockResolvedValue({});
      await service.deductStock(1, 1, null, 5);
      expect(mockBatchService.deductQuantity).toHaveBeenCalledWith(1, 5);
    });

    it('should throw ConflictException when insufficient stock', async () => {
      const inv = { available_quantity: 2, batch: mockBatch };
      mockRepo.find.mockResolvedValue([inv]);
      mockRepo.save.mockResolvedValue({});
      await expect(service.deductStock(1, 1, null, 10)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
