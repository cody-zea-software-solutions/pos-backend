import { Test, TestingModule } from '@nestjs/testing';
import { ShopInventoryService } from './shop-inventory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShopInventory } from './shop-inventory.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ShopService } from '../../shop/shop.service';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { BatchesService } from '../batches/batches.service';
import { UsersService } from '../../users/users.service';
import { ConsignorService } from '../consignor/consignor.service';

// ---------------------------
// Mock Repository
// ---------------------------
type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  delete: jest.fn(),
});

// ---------------------------
// Mock Services
// ---------------------------
class MockShopService {}
class MockProductService {}
class MockProductVariationService {}
class MockBatchesService {}
class MockUsersService {}
class MockConsignorService {}

// ---------------------------
// Test Suite
// ---------------------------
describe('ShopInventoryService', () => {
  let service: ShopInventoryService;
  let repo: MockRepository<ShopInventory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopInventoryService,
        { provide: getRepositoryToken(ShopInventory), useFactory: mockRepository },
        { provide: ShopService, useClass: MockShopService },
        { provide: ProductService, useClass: MockProductService },
        { provide: ProductVariationService, useClass: MockProductVariationService },
        { provide: BatchesService, useClass: MockBatchesService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: ConsignorService, useClass: MockConsignorService },
      ],
    }).compile();

    service = module.get<ShopInventoryService>(ShopInventoryService);
    repo = module.get<MockRepository<ShopInventory>>(getRepositoryToken(ShopInventory));
  });

  afterEach(() => jest.clearAllMocks());

  // ---------------------------
  // findAll
  // ---------------------------
  describe('findAll', () => {
    it('should return all inventories', async () => {
      const expected = [{ id: 1, available_quantity: 50 }];
      repo.find!.mockResolvedValue(expected);

      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(repo.find).toHaveBeenCalledTimes(1);
    });
  });

  // ---------------------------
  // findOne
  // ---------------------------
  describe('findOne', () => {
    it('should return one inventory', async () => {
      const inventory = { id: 1, available_quantity: 100 };
      repo.findOne!.mockResolvedValue(inventory);

      const result = await service.findOne(1);
      expect(result).toEqual(inventory);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne!.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------
  // create
  // ---------------------------
  describe('create', () => {
    it('should create a new inventory', async () => {
      const dto = { shop_id: 1, product_id: 2, available_quantity: 30 };
      const entity = { id: 1, ...dto };

      repo.create!.mockReturnValue(entity);
      repo.save!.mockResolvedValue(entity);

      const result = await service.create(dto);
      expect(result).toEqual(entity);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(entity);
    });
  });

  // ---------------------------
  // update
  // ---------------------------
  describe('update', () => {
    it('should update an existing inventory', async () => {
      const existing = { id: 1, available_quantity: 50 };
      const updated = { ...existing, available_quantity: 70 };

      repo.findOne!.mockResolvedValue(existing);
      repo.save!.mockResolvedValue(updated);

      const result = await service.update(1, { available_quantity: 70 });
      expect(result).toEqual(updated);
      expect(repo.save).toHaveBeenCalledWith(updated);
    });
  });

  // ---------------------------
  // remove
  // ---------------------------
  describe('remove', () => {
    it('should remove an inventory', async () => {
      const inventory = { id: 1 };
      repo.findOne!.mockResolvedValue(inventory);
      repo.remove!.mockResolvedValue(inventory);

      const result = await service.remove(1);
      expect(result).toEqual(inventory);
      expect(repo.remove).toHaveBeenCalledWith(inventory);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne!.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
