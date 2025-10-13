import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionPlanService } from './subscription-plan.service';
import { SubscriptionPlan } from './subscription-plan.entity';
import { Shop } from '../shop/shop.entity';
import { User } from '../users/user.entity';
import { Product } from '../product-management/product/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';

// ✅ Type-safe mock repository helper
type MockRepo<T extends ObjectLiteral = any> = {
  [P in keyof Repository<T>]?: jest.Mock;
};

const createMockRepo = <T extends ObjectLiteral = any>(): MockRepo<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  count: jest.fn(),
});

describe('SubscriptionPlanService', () => {
  let service: SubscriptionPlanService;
  let planRepo: MockRepo<SubscriptionPlan>;
  let shopRepo: MockRepo<Shop>;
  let userRepo: MockRepo<User>;
  let productRepo: MockRepo<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionPlanService,
        { provide: getRepositoryToken(SubscriptionPlan), useValue: createMockRepo<SubscriptionPlan>() },
        { provide: getRepositoryToken(Shop), useValue: createMockRepo<Shop>() },
        { provide: getRepositoryToken(User), useValue: createMockRepo<User>() },
        { provide: getRepositoryToken(Product), useValue: createMockRepo<Product>() },
      ],
    }).compile();

    service = module.get<SubscriptionPlanService>(SubscriptionPlanService);
    planRepo = module.get(getRepositoryToken(SubscriptionPlan));
    shopRepo = module.get(getRepositoryToken(Shop));
    userRepo = module.get(getRepositoryToken(User));
    productRepo = module.get(getRepositoryToken(Product));
  });

  // -----------------------------
  // CREATE TESTS
  // -----------------------------
  describe('create', () => {
    it('should create a new subscription plan successfully', async () => {
      const dto: CreateSubscriptionPlanDto = {
        plan_name: 'Standard Plan',
        plan_code: 'STD001',
        max_products: 100,
        max_branches: 5,
        max_users: 10,
        is_active: false,
        has_loyalty_features: false,
        has_inventory_management: false,
        has_reporting_analytics: false,
        has_multi_branch_pricing: false,
        has_gst_management: false,
        has_batch_tracking: false,
      };

      planRepo.findOne!.mockResolvedValue(null);
      planRepo.create!.mockReturnValue(dto);
      planRepo.save!.mockResolvedValue(dto);

      const result = await service.create(dto);
      expect(result).toEqual(dto);
      expect(planRepo.create).toHaveBeenCalledWith(dto);
      expect(planRepo.save).toHaveBeenCalledWith(dto);
    });

    it('should throw ConflictException if plan code exists', async () => {
      const dto: CreateSubscriptionPlanDto = {
        plan_name: 'Basic Plan',
        plan_code: 'BASIC',
        max_products: 10,
        max_branches: 1,
        max_users: 2,
        is_active: false,
        has_loyalty_features: false,
        has_inventory_management: false,
        has_reporting_analytics: false,
        has_multi_branch_pricing: false,
        has_gst_management: false,
        has_batch_tracking: false,
      };

      planRepo.findOne!.mockResolvedValue({ plan_id: 1 });
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if active plan already exists', async () => {
      const dto: CreateSubscriptionPlanDto = {
        plan_name: 'Premium',
        plan_code: 'PREM',
        max_products: 500,
        max_branches: 10,
        max_users: 20,
        is_active: true,
        has_loyalty_features: false,
        has_inventory_management: false,
        has_reporting_analytics: false,
        has_multi_branch_pricing: false,
        has_gst_management: false,
        has_batch_tracking: false,
      };

      planRepo.findOne!.mockResolvedValueOnce(null); // For code check
      planRepo.findOne!.mockResolvedValueOnce({ plan_id: 2, plan_name: 'Old Active Plan' }); // For active check

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  // -----------------------------
  // FIND TESTS
  // -----------------------------
  describe('findAll', () => {
    it('should return all subscription plans', async () => {
      const plans = [{ plan_id: 1, plan_name: 'Plan A' }];
      planRepo.find!.mockResolvedValue(plans);

      const result = await service.findAll();
      expect(result).toEqual(plans);
    });
  });

  describe('findOne', () => {
    it('should return a single plan by ID', async () => {
      const plan = { plan_id: 1, plan_name: 'Plan A' };
      planRepo.findOne!.mockResolvedValue(plan);

      const result = await service.findOne(1);
      expect(result).toEqual(plan);
    });

    it('should throw NotFoundException if not found', async () => {
      planRepo.findOne!.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  // -----------------------------
  // UPDATE TESTS
  // -----------------------------
  describe('update', () => {
    it('should update a subscription plan successfully', async () => {
      const existingPlan = { plan_id: 1, plan_name: 'Old', is_active: false };
      const dto = { plan_name: 'Updated Plan', is_active: false };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingPlan as any);
      planRepo.save!.mockResolvedValue({ ...existingPlan, ...dto });

      const result = await service.update(1, dto);
      expect(result.plan_name).toBe('Updated Plan');
    });

    it('should throw BadRequestException if another active plan exists', async () => {
      const existingPlan = { plan_id: 1, plan_name: 'Old Plan', is_active: false };
      const dto = { is_active: true };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingPlan as any);
      planRepo.findOne!.mockResolvedValue({ plan_id: 2, plan_name: 'Active Plan' });

      await expect(service.update(1, dto)).rejects.toThrow(BadRequestException);
    });
  });

  // -----------------------------
  // REMOVE TESTS
  // -----------------------------
  describe('remove', () => {
    it('should remove a subscription plan', async () => {
      const plan = { plan_id: 1, plan_name: 'To Delete' };
      jest.spyOn(service, 'findOne').mockResolvedValue(plan as any);
      planRepo.remove!.mockResolvedValue(plan);

      await service.remove(1);
      expect(planRepo.remove).toHaveBeenCalledWith(plan);
    });
  });

  // -----------------------------
  // VALIDATE LIMIT TESTS
  // -----------------------------
  describe('validateLimit', () => {
    it('should throw ForbiddenException if shop limit exceeded', async () => {
      jest.spyOn(service, 'getActivePlan').mockResolvedValue({
        max_branches: 1,
      } as SubscriptionPlan);
      shopRepo.count!.mockResolvedValue(2);

      await expect(service.validateLimit('shop')).rejects.toThrow(ForbiddenException);
    });

    it('should pass if within user limit', async () => {
      jest.spyOn(service, 'getActivePlan').mockResolvedValue({
        max_users: 5,
      } as SubscriptionPlan);
      userRepo.count!.mockResolvedValue(3);

      await expect(service.validateLimit('user')).resolves.not.toThrow();
    });
  });
});
