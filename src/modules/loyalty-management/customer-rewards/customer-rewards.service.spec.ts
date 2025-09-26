import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRewardsService } from './customer-rewards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRewards } from './customer-rewards.entity';
import { CreateCustomerRewardsDto } from './dto/create-rewards.dto';
import { UpdateCustomerRewardsDto } from './dto/update-rewards.dto';

describe('CustomerRewardsService', () => {
  let service: CustomerRewardsService;
  let repo: jest.Mocked<Repository<CustomerRewards>>;

  const mockReward: CustomerRewards = {
    customer_reward_id: 1,
    customer: { customer_id: 1 } as any,
    reward: { reward_id: 1 } as any,
    redeemed_date: new Date(),
    used_date: new Date(),
    shop: { shop_id: 1 } as any,
    counter: { counter_id: 1 } as any,
    status: 'Active',
    transaction_ref: 'TXN001',
    processed_by_user: { user_id: 1 } as any,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerRewardsService,
        {
          provide: getRepositoryToken(CustomerRewards),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CustomerRewardsService>(CustomerRewardsService);
    repo = module.get(getRepositoryToken(CustomerRewards));
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a reward', async () => {
    const dto: CreateCustomerRewardsDto = {
      customer_id: 1,
      reward_id: 1,
      redeemed_date: new Date().toISOString(),
      used_date: new Date().toISOString(),
      shop_id: 1,
      counter_id: 1,
      status: 'Active',
      transaction_ref: 'TXN001',
      processed_by_user: 1,
    };

    mockRepo.create.mockReturnValue(mockReward);
    mockRepo.save.mockResolvedValue(mockReward);

    const result = await service.create(dto);
    expect(mockRepo.create).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalledWith(mockReward);
    expect(result).toEqual(mockReward);
  });

  it('should return all rewards', async () => {
    mockRepo.find.mockResolvedValue([mockReward]);
    const result = await service.findAll();
    expect(result).toEqual([mockReward]);
    expect(mockRepo.find).toHaveBeenCalled();
  });

  it('should find one reward by id', async () => {
    mockRepo.findOne.mockResolvedValue(mockReward);
    const result = await service.findOne(1);
    expect(result).toEqual(mockReward);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { customer_reward_id: 1 } });
  });

  it('should update a reward successfully (status only)', async () => {
    const updateDto: UpdateCustomerRewardsDto = { status: 'Used' };
    mockRepo.findOne.mockResolvedValue(mockReward);
    mockRepo.save.mockResolvedValue({ ...mockReward, status: 'Used' });

    const result = await service.update(1, updateDto);
    expect(mockRepo.findOne).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
    expect(result.status).toBe('Used');
  });

  it('should update customer, reward, shop, counter, and processed_by_user if provided', async () => {
    const updateDto: UpdateCustomerRewardsDto = {
      customer_id: 10,
      reward_id: 20,
      shop_id: 30,
      counter_id: 40,
      processed_by_user: 50,
      status: 'Active',
    };

    mockRepo.findOne.mockResolvedValue({ ...mockReward });
    mockRepo.save.mockResolvedValue({
      ...mockReward,
      ...updateDto,
      customer: { customer_id: 10 },
      reward: { reward_id: 20 },
      shop: { shop_id: 30 },
      counter: { counter_id: 40 },
      processed_by_user: { user_id: 50 },
    });

    const result = await service.update(1, updateDto);

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { customer_reward_id: 1 } });
    expect(mockRepo.save).toHaveBeenCalled();
    expect(result.customer.customer_id).toBe(10);
    expect(result.reward.reward_id).toBe(20);
    expect(result.shop.shop_id).toBe(30);
    expect(result.counter.counter_id).toBe(40);
    expect(result.processed_by_user.user_id).toBe(50);
  });

  it('should throw error when reward not found on update', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.update(999, { status: 'Expired' })).rejects.toThrow(
      'CustomerReward with ID 999 not found',
    );
  });

  it('should remove reward and return result', async () => {
    mockRepo.delete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(1);
    expect(result).toEqual({ affected: 1 });
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it('should return delete result even when not found', async () => {
    mockRepo.delete.mockResolvedValue({ affected: 0 });
    const result = await service.remove(999);
    expect(result).toEqual({ affected: 0 });
  });
});
