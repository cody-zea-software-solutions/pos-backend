import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionPlanController } from './subscription-plan.controller';
import { SubscriptionPlanService } from './subscription-plan.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

describe('SubscriptionPlanController', () => {
  let controller: SubscriptionPlanController;
  let service: SubscriptionPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionPlanController],
      providers: [
        {
          provide: SubscriptionPlanService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubscriptionPlanController>(SubscriptionPlanController);
    service = module.get<SubscriptionPlanService>(SubscriptionPlanService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ---------- CREATE ----------
  describe('create', () => {
    it('should call service.create', async () => {
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

      (service.create as jest.Mock).mockResolvedValue(dto);
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(dto);
    });
  });

  // ---------- FIND ALL ----------
  describe('findAll', () => {
    it('should return list of plans', async () => {
      const plans = [{ plan_id: 1 }];
      (service.findAll as jest.Mock).mockResolvedValue(plans);
      const result = await controller.findAll();
      expect(result).toEqual(plans);
    });
  });

  // ---------- FIND ONE ----------
  describe('findOne', () => {
    it('should return plan by id', async () => {
      const plan = { plan_id: 1 };
      (service.findOne as jest.Mock).mockResolvedValue(plan);
      const result = await controller.findOne(1);
      expect(result).toEqual(plan);
    });
  });

  // ---------- UPDATE ----------
  describe('update', () => {
    it('should update plan', async () => {
      const dto: UpdateSubscriptionPlanDto = { plan_name: 'Updated Plan' };
      const updated = { plan_id: 1, ...dto };
      (service.update as jest.Mock).mockResolvedValue(updated);

      const result = await controller.update(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updated);
    });
  });

  // ---------- REMOVE ----------
  describe('remove', () => {
    it('should call service.remove', async () => {
      (service.remove as jest.Mock).mockResolvedValue(undefined);
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
