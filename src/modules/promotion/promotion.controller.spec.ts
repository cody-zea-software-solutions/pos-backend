import { Test, TestingModule } from '@nestjs/testing';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { Promotion } from './promotion.entity';

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

describe('PromotionController', () => {
  let controller: PromotionController;
  let service: PromotionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionController],
      providers: [
        {
          provide: PromotionService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPromotion),
            findAll: jest.fn().mockResolvedValue([mockPromotion]),
            findOne: jest.fn().mockResolvedValue(mockPromotion),
            update: jest.fn().mockResolvedValue(mockPromotion),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<PromotionController>(PromotionController);
    service = module.get<PromotionService>(PromotionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a promotion', async () => {
    const dto = { promotion_name: 'Test', promotion_type: 'discount', created_by_user: 1 };
    const result = await controller.create(dto as any);
    expect(result).toEqual(mockPromotion);
    expect(service.create).toHaveBeenCalled();
  });

  it('should return all promotions', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockPromotion]);
  });

  it('should return one promotion', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockPromotion);
  });

  it('should update a promotion', async () => {
    const dto = { promotion_name: 'Updated' };
    const result = await controller.update('1', dto as any);
    expect(result).toEqual(mockPromotion);
  });

  it('should remove a promotion', async () => {
    await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
