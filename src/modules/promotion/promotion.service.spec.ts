import { Test, TestingModule } from '@nestjs/testing';
import { PromotionService } from './promotion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Promotion } from './promotion.entity';
import { Repository } from 'typeorm';
import { ShopService } from '../shop/shop.service';
import { CounterService } from '../counter/counter.service';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';

// Mock data
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
  let repo: jest.Mocked<Repository<Promotion>>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockShopService = { findOne: jest.fn() };
  const mockCounterService = { findOne: jest.fn() };
  const mockUserService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionService,
        { provide: getRepositoryToken(Promotion), useValue: mockRepo },
        { provide: ShopService, useValue: mockShopService },
        { provide: CounterService, useValue: mockCounterService },
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<PromotionService>(PromotionService);
    repo = module.get(getRepositoryToken(Promotion));
  });

  afterEach(() => jest.clearAllMocks());

  // ---------------- FIND ALL ----------------
  describe('findAll', () => {
    it('should return all promotions', async () => {
      mockRepo.find.mockResolvedValue([mockPromotion]);
      const result = await service.findAll();
      expect(result).toEqual([mockPromotion]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  // ---------------- FIND ONE ----------------
  describe('findOne', () => {
    it('should return a promotion if found', async () => {
      mockRepo.findOne.mockResolvedValue(mockPromotion);
      const result = await service.findOne(1);
      expect(result).toEqual(mockPromotion);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------- CREATE ----------------
  describe('create', () => {
    it('should create and save a promotion', async () => {
      mockRepo.create.mockReturnValue(mockPromotion);
      mockRepo.save.mockResolvedValue(mockPromotion);
      mockUserService.findOne.mockResolvedValue({ id: 1 });

      const dto = { promotion_name: 'Test', promotion_type: 'discount', created_by_user: 1 };
      const result = await service.create(dto as any);

      expect(result).toEqual(mockPromotion);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });
  });

  // ---------------- UPDATE ----------------
  describe('update', () => {
    it('should update and return the promotion', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPromotion);
      mockRepo.save.mockResolvedValue({ ...mockPromotion, promotion_name: 'Updated Promo' });

      const result = await service.update(1, { promotion_name: 'Updated Promo' } as any);

      expect(repo.save).toHaveBeenCalled();
      expect(result.promotion_name).toBe('Updated Promo');
    });

    it('should throw NotFoundException if promotion not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------- REMOVE ----------------
  describe('remove', () => {
    it('should remove a promotion', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPromotion);
      mockRepo.remove.mockResolvedValue(mockPromotion);

      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockPromotion);
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
