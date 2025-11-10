import { Test, TestingModule } from '@nestjs/testing';
import { PromotionService } from './promotion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Promotion } from './promotion.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ShopService } from '../shop/shop.service';
import { CounterService } from '../counter/counter.service';
import { UsersService } from '../users/users.service';
import { LoyaltyLevelsService } from '../loyalty-management/loyalty-levels/loyalty-levels.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

describe('PromotionService', () => {
  let service: PromotionService;
  let repo: Repository<Promotion>;
  let shopService: ShopService;
  let counterService: CounterService;
  let userService: UsersService;
  let loyaltyLevelService: LoyaltyLevelsService;

 const mockPromotion = {
  promotion_id: 1,
  promotion_name: 'Summer Sale',
  promotion_type: 'Discount',
  start_date: new Date(),
  end_date: new Date(),
  description: 'Discount on all items',
} as unknown as Promotion;
  const mockRepo = {
    create: jest.fn().mockReturnValue(mockPromotion),
    save: jest.fn().mockResolvedValue(mockPromotion),
    find: jest.fn().mockResolvedValue([mockPromotion]),
    findOne: jest.fn(),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  const mockShopService = { findOne: jest.fn().mockResolvedValue({ shop_id: 1 }) };
  const mockCounterService = { findOne: jest.fn().mockResolvedValue({ counter_id: 1 }) };
  const mockUserService = { findOne: jest.fn().mockResolvedValue({ user_id: 1 }) };
  const mockLoyaltyLevelService = { findOne: jest.fn().mockResolvedValue({ level_id: 1 }) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionService,
        { provide: getRepositoryToken(Promotion), useValue: mockRepo },
        { provide: ShopService, useValue: mockShopService },
        { provide: CounterService, useValue: mockCounterService },
        { provide: UsersService, useValue: mockUserService },
        { provide: LoyaltyLevelsService, useValue: mockLoyaltyLevelService },
      ],
    }).compile();

    service = module.get<PromotionService>(PromotionService);
    repo = module.get<Repository<Promotion>>(getRepositoryToken(Promotion));
    shopService = module.get<ShopService>(ShopService);
    counterService = module.get<CounterService>(CounterService);
    userService = module.get<UsersService>(UsersService);
    loyaltyLevelService = module.get<LoyaltyLevelsService>(LoyaltyLevelsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create()', () => {
    it('should create and return a promotion', async () => {
      const dto: CreatePromotionDto = {
        title: 'Summer Sale',
        created_by_user: 1,
      } as any;

      const result = await service.create(dto);

      expect(userService.findOne).toHaveBeenCalledWith(1);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockPromotion);
    });
  });

  describe('findAll()', () => {
    it('should return all promotions', async () => {
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith({
        relations: ['shop', 'counter', 'created_by', 'loyalty_level'],
      });
      expect(result).toEqual([mockPromotion]);
    });
  });

  describe('findOne()', () => {
    it('should return a promotion by ID', async () => {
      mockRepo.findOne.mockResolvedValueOnce(mockPromotion);
      const result = await service.findOne(1);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { promotion_id: 1 },
        relations: ['shop', 'counter', 'created_by', 'loyalty_level'],
      });
      expect(result).toEqual(mockPromotion);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update a promotion', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockPromotion);
      const dto: UpdatePromotionDto = { title: 'Updated Sale' } as any;

      const result = await service.update(1, dto);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockPromotion);
    });
  });

  describe('remove()', () => {
    it('should remove a promotion', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockPromotion);
      await service.remove(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repo.remove).toHaveBeenCalledWith(mockPromotion);
    });
  });
});
