import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyRewardsService } from './loyalty-rewards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoyaltyReward } from './loyalty-rewards.entity';
import { Repository } from 'typeorm';
import { CreateLoyaltyRewardsDto } from './dto/create-loyalty-rewards.dto';
import { UpdateLoyaltyRewardsDto } from './dto/update-loyalty-rewards.dto';

describe('LoyaltyRewardsService', () => {
  let service: LoyaltyRewardsService;
  let repo: Repository<LoyaltyReward>;

  const mockReward: LoyaltyReward = {
    reward_id: 1,
    reward_name: 'Test Reward',
    reward_type: 'voucher',
    points_required: 100,
    value_amount: 50,
    description:'',
    valid_from: new Date(),
    valid_until:new Date(),
    usage_limit_per_customer: 0,
    total_usage_limit: 0,
    is_active: true,
    reward_code: '',
    terms_conditions: '',
    created_at: new Date(),
    customerRewards: [],
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockReward),
    save: jest.fn().mockResolvedValue(mockReward),
    find: jest.fn().mockResolvedValue([mockReward]),
    findOneBy: jest.fn().mockResolvedValue(mockReward),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyRewardsService,
        {
          provide: getRepositoryToken(LoyaltyReward),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LoyaltyRewardsService>(LoyaltyRewardsService);
    repo = module.get<Repository<LoyaltyReward>>(getRepositoryToken(LoyaltyReward));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and save a reward', async () => {
    const dto: CreateLoyaltyRewardsDto = {
      reward_name: 'Test Reward',
      reward_type: 'voucher',
      points_required: 100,
      value_amount: 50,
    };
    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(mockReward);
    expect(result).toEqual(mockReward);
  });

  it('should return all rewards', async () => {
    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual([mockReward]);
  });

  it('should return one reward by id', async () => {
    const result = await service.findOne(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ reward_id: 1 });
    expect(result).toEqual(mockReward);
  });

  it('should update a reward', async () => {
    const dto: UpdateLoyaltyRewardsDto = { reward_name: 'Updated Reward' };
    const result = await service.update(1, dto);
    expect(repo.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(mockReward);
  });

  it('should remove a reward', async () => {
    const result = await service.remove(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ affected: 1 });
  });
});
