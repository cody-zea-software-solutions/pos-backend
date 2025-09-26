import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyPointsService } from './loyalty-points.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoyaltyPoints } from './loyalty-points.entity';
import { Customer } from '../customer/customer.entity';
import { Shop } from '../../shop/shop.entity';
import { Counter } from '../../counter/counter.entity';
import { User } from '../../users/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('LoyaltyPointsService', () => {
  let service: LoyaltyPointsService;
  let loyaltyPointsRepo: jest.Mocked<Repository<LoyaltyPoints>>;
  let customerRepo: jest.Mocked<Repository<Customer>>;
  let shopRepo: jest.Mocked<Repository<Shop>>;
  let counterRepo: jest.Mocked<Repository<Counter>>;
  let userRepo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    loyaltyPointsRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<Repository<LoyaltyPoints>>;

    customerRepo = { findOne: jest.fn() } as unknown as jest.Mocked<Repository<Customer>>;
    shopRepo = { findOne: jest.fn() } as unknown as jest.Mocked<Repository<Shop>>;
    counterRepo = { findOne: jest.fn() } as unknown as jest.Mocked<Repository<Counter>>;
    userRepo = { findOne: jest.fn() } as unknown as jest.Mocked<Repository<User>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyPointsService,
        { provide: getRepositoryToken(LoyaltyPoints), useValue: loyaltyPointsRepo },
        { provide: getRepositoryToken(Customer), useValue: customerRepo },
        { provide: getRepositoryToken(Shop), useValue: shopRepo },
        { provide: getRepositoryToken(Counter), useValue: counterRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<LoyaltyPointsService>(LoyaltyPointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ================= findAll =================
  describe('findAll', () => {
    it('should return all loyalty points', async () => {
      const points = [{ point_id: 1 }, { point_id: 2 }] as LoyaltyPoints[];
      loyaltyPointsRepo.find.mockResolvedValue(points);

      const result = await service.findAll();
      expect(result).toEqual(points);
      expect(loyaltyPointsRepo.find).toHaveBeenCalled();
    });
  });

  // ================= findOne =================
  describe('findOne', () => {
    it('should throw NotFoundException if record does not exist', async () => {
      loyaltyPointsRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return the record if found', async () => {
      const entity = { point_id: 1 } as LoyaltyPoints;
      loyaltyPointsRepo.findOne.mockResolvedValue(entity);

      const result = await service.findOne(1);
      expect(result).toEqual(entity);
    });
  });

  // ================= create =================
  describe('create', () => {
    it('should throw BadRequestException if customer not found', async () => {
      customerRepo.findOne.mockResolvedValue(null);
      await expect(service.create({ customer_id: 1 } as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if shop not found', async () => {
      customerRepo.findOne.mockResolvedValue({ customer_id: 1 } as Customer);
      shopRepo.findOne.mockResolvedValue(null);
      counterRepo.findOne.mockResolvedValue({ counter_id: 1 } as Counter);
      userRepo.findOne.mockResolvedValue({ user_id: 1 } as User);

      await expect(service.create({
        customer_id: 1, shop_id: 1, counter_id: 1, created_by_user: 1,
        points_earned: 50, transaction_type: 'PURCHASE', transaction_ref: 'TXN123'
      })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if counter not found', async () => {
      customerRepo.findOne.mockResolvedValue({ customer_id: 1 } as Customer);
      shopRepo.findOne.mockResolvedValue({ shop_id: 1 } as Shop);
      counterRepo.findOne.mockResolvedValue(null);
      userRepo.findOne.mockResolvedValue({ user_id: 1 } as User);

      await expect(service.create({
        customer_id: 1, shop_id: 1, counter_id: 1, created_by_user: 1,
        points_earned: 50, transaction_type: 'PURCHASE', transaction_ref: 'TXN123'
      })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if createdBy user not found', async () => {
      customerRepo.findOne.mockResolvedValue({ customer_id: 1 } as Customer);
      shopRepo.findOne.mockResolvedValue({ shop_id: 1 } as Shop);
      counterRepo.findOne.mockResolvedValue({ counter_id: 1 } as Counter);
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.create({
        customer_id: 1, shop_id: 1, counter_id: 1, created_by_user: 1,
        points_earned: 50, transaction_type: 'PURCHASE', transaction_ref: 'TXN123'
      })).rejects.toThrow(BadRequestException);
    });

    it('should save and return created entity', async () => {
      customerRepo.findOne.mockResolvedValue({ customer_id: 1 } as Customer);
      shopRepo.findOne.mockResolvedValue({ shop_id: 1 } as Shop);
      counterRepo.findOne.mockResolvedValue({ counter_id: 1 } as Counter);
      userRepo.findOne.mockResolvedValue({ user_id: 1 } as User);

      const mockEntity = { point_id: 1 } as LoyaltyPoints;
      loyaltyPointsRepo.create.mockReturnValue(mockEntity);
      loyaltyPointsRepo.save.mockResolvedValue(mockEntity);

      const result = await service.create({
        customer_id: 1, shop_id: 1, counter_id: 1, created_by_user: 1,
        points_earned: 50, transaction_type: 'PURCHASE', transaction_ref: 'TXN123'
      });

      expect(result).toEqual(mockEntity);
      expect(loyaltyPointsRepo.save).toHaveBeenCalledWith(mockEntity);
    });

    it('should default optional fields if undefined', async () => {
      customerRepo.findOne.mockResolvedValue({ customer_id: 1 } as Customer);
      shopRepo.findOne.mockResolvedValue({ shop_id: 1 } as Shop);
      counterRepo.findOne.mockResolvedValue({ counter_id: 1 } as Counter);
      userRepo.findOne.mockResolvedValue({ user_id: 1 } as User);

      const mockEntity = { point_id: 1 } as LoyaltyPoints;
      loyaltyPointsRepo.create.mockReturnValue(mockEntity);
      loyaltyPointsRepo.save.mockResolvedValue(mockEntity);

      const result = await service.create({
        customer_id: 1, shop_id: 1, counter_id: 1, created_by_user: 1,
        points_earned: 50, transaction_type: 'PURCHASE', transaction_ref: 'TXN123'
      });

      expect(result).toEqual(mockEntity);
    });
  });

  // ================= update =================
  it('should update all scalar fields correctly', async () => {
  const existing = {
    point_id: 1,
    points_earned: 10,
    points_redeemed: 5,
    transaction_type: 'PURCHASE',
    transaction_ref: 'OLD',
    description: 'old',
    expiry_date: new Date('2025-01-01'),
    is_active: true,
  } as LoyaltyPoints;

  // Mock findOne to return the existing record
  loyaltyPointsRepo.findOne.mockResolvedValue(existing);

  // Mock save to return the updated entity
  loyaltyPointsRepo.save.mockImplementation(async (entity: any) => ({
    ...existing,
    ...entity,
    expiry_date: entity.expiry_date ? new Date(entity.expiry_date) : existing.expiry_date,
  }));

  const dto = {
    points_earned: 100,
    points_redeemed: 50,
    transaction_type: 'REDEMPTION',
    transaction_ref: 'NEW',
    description: 'updated',
    expiry_date: '2026-01-01',
    is_active: false,
  };

  const result = await service.update(1, dto);

  expect(result.points_earned).toBe(100);
  expect(result.points_redeemed).toBe(50);
  expect(result.transaction_type).toBe('REDEMPTION');
  expect(result.transaction_ref).toBe('NEW');
  expect(result.description).toBe('updated');
  expect(result.expiry_date).toEqual(new Date('2026-01-01'));
  expect(result.is_active).toBe(false);
});


  // ================= remove =================
  describe('remove', () => {
    it('should remove entity if exists', async () => {
      const existing = { point_id: 1 } as LoyaltyPoints;
      loyaltyPointsRepo.findOne.mockResolvedValue(existing);
      loyaltyPointsRepo.remove.mockResolvedValue(existing);

      await service.remove(1);
      expect(loyaltyPointsRepo.remove).toHaveBeenCalledWith(existing);
    });
  });
});
