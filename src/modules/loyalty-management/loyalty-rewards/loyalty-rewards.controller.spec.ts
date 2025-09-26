import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyRewardsController } from './loyalty-rewards.controller';
import { LoyaltyRewardsService } from './loyalty-rewards.service';
import { CreateLoyaltyRewardsDto } from './dto/create-loyalty-rewards.dto';
import { UpdateLoyaltyRewardsDto } from './dto/update-loyalty-rewards.dto';

describe('LoyaltyRewardsController', () => {
  let controller: LoyaltyRewardsController;
  let service: LoyaltyRewardsService;

  const mockLoyaltyRewardsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyRewardsController],
      providers: [
        {
          provide: LoyaltyRewardsService,
          useValue: mockLoyaltyRewardsService,
        },
      ],
    }).compile();

    controller = module.get<LoyaltyRewardsController>(LoyaltyRewardsController);
    service = module.get<LoyaltyRewardsService>(LoyaltyRewardsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create with correct dto', async () => {
    const dto: CreateLoyaltyRewardsDto = {
      reward_name: 'Test Reward',
      reward_type: 'voucher',
      points_required: 100,
      value_amount: 50,
    };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.findAll', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne with correct id', async () => {
    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should call service.update with correct params', async () => {
    const dto: UpdateLoyaltyRewardsDto = { reward_name: 'Updated Reward' };
    await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call service.remove with correct id', async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
