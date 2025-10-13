import { Test, TestingModule } from '@nestjs/testing';
import { PromotionService } from './promotion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Promotion } from './promotion.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { ShopService } from '../shop/shop.service';
import { CounterService } from '../counter/counter.service';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';

// ✅ Type-safe mock repo
type MockRepo<T extends ObjectLiteral = any> = {
  [P in keyof Repository<T>]: jest.Mock;
};

const mockPromotion: Promotion = {
  promotion_id: 1,
  promotion_name: 'Test Promo',
  description: 'Test Desc',
  promotion_type: 'discount',
  start_date: new Date(),
  end_date: new Date(),
  target_audience: 'all',
  shop: null as any,
  counter: null as any,
  target_level_id: null as any,
  promotion_rules: 'rule1',
  is_active: true,
  created_by: null as any,
  applies_to_variations: false,
  applies_to_consignment: false,
  is_gst_inclusive: false,
  created_at: new Date(),
};

describe('PromotionService', () => {
  let service: PromotionService;
  let repo: MockRepo<Promotion>;

  beforeEach(async () => {
    repo = {
      create: jest.fn().mockReturnValue(mockPromotion),
      save: jest.fn().mockResolvedValue(mockPromotion),
      find: jest.fn().mockResolvedValue([mockPromotion]),
      findOne: jest.fn(),
      remove: jest.fn(),
      preload: jest.fn(),
      // include other repository stubs
      count: jest.fn(),
      findAndCount: jest.fn(),
      findBy: jest.fn(),
      findOneBy: jest.fn(),
      findOneOrFail: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
      softDelete: jest.fn(),
      restore: jest.fn(),
      query: jest.fn(),
      manager: {} as any,
      metadata: {} as any,
      target: {} as any,
      createQueryBuilder: jest.fn(),
      merge: jest.fn(),
      clear: jest.fn(),
      decrement: jest.fn(),
      increment: jest.fn(),
    } as unknown as MockRepo<Promotion>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionService,
        { provide: getRepositoryToken(Promotion), useValue: repo },
        { provide: ShopService, useValue: { findOne: jest.fn() } },
        { provide: CounterService, useValue: { findOne: jest.fn() } },
        { provide: UsersService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    service = module.get<PromotionService>(PromotionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------------- FIND ALL ----------------
  describe('findAll', () => {
    it('should return all promotions', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockPromotion]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  // ---------------- FIND ONE ----------------
  describe('findOne', () => {
    it('should return a promotion if found', async () => {
      repo.findOne.mockResolvedValue(mockPromotion);
      const result = await service.findOne(1);
      expect(result).toEqual(mockPromotion);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------- CREATE ----------------
  describe('create', () => {
    it('should create and save a promotion', async () => {
      const dto = { promotion_name: 'Test', promotion_type: 'discount', created_by_user: 1 };
      const result = await service.create(dto as any);
      expect(result).toEqual(mockPromotion);
      expect(repo.save).toHaveBeenCalled();
    });

    it('should handle optional fields gracefully', async () => {
      const dto = { promotion_name: 'Test 2', promotion_type: 'bogo', created_by_user: 2, description: 'desc' };
      repo.save.mockResolvedValue({ ...mockPromotion, ...dto });
      const result = await service.create(dto as any);
      expect(result.promotion_type).toBe('bogo');
      expect(repo.create).toHaveBeenCalled();
    });
  });

  // ---------------- UPDATE ----------------
  describe('update', () => {
    it('should update and return the promotion', async () => {
      const dto = { promotion_name: 'Updated Promo' };
      repo.preload.mockResolvedValue({ ...mockPromotion, ...dto });
      repo.save.mockResolvedValue({ ...mockPromotion, ...dto });

      const result = await service.update(1, dto as any);

      expect(repo.preload).toHaveBeenCalledWith({ promotion_id: 1, ...dto });
      expect(repo.save).toHaveBeenCalled();
      expect(result.promotion_name).toBe('Updated Promo');
    });

    it('should throw NotFoundException if promotion not found', async () => {
      repo.preload.mockResolvedValue(null);
      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------- REMOVE ----------------
  describe('remove', () => {
    it('should remove a promotion', async () => {
      repo.findOne.mockResolvedValue(mockPromotion);
      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockPromotion);
    });

    it('should throw NotFoundException if promotion not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
