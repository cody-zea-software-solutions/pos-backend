import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRewardsController } from './customer-rewards.controller';
import { CustomerRewardsService } from './customer-rewards.service';
import { CreateCustomerRewardsDto } from './dto/create-rewards.dto';
import { UpdateCustomerRewardsDto } from './dto/update-rewards.dto';

describe('CustomerRewardsController', () => {
  let controller: CustomerRewardsController;
  let service: CustomerRewardsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockReward = { customer_reward_id: 1, status: 'active' };

  const createDto: CreateCustomerRewardsDto = {
    customer_id: 10,
    reward_id: 5,
    shop_id: 2,
    counter_id: 3,
    status: 'active',
    processed_by_user: 99,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerRewardsController],
      providers: [{ provide: CustomerRewardsService, useValue: mockService }],
    }).compile();

    controller = module.get<CustomerRewardsController>(CustomerRewardsController);
    service = module.get<CustomerRewardsService>(CustomerRewardsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create reward', async () => {
    mockService.create.mockResolvedValue(mockReward);
    const result = await controller.create(createDto);
    expect(service.create).toHaveBeenCalledWith(createDto);
    expect(result).toEqual(mockReward);
  });

  it('should get all rewards', async () => {
    mockService.findAll.mockResolvedValue([mockReward]);
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockReward]);
  });

  it('should get one reward', async () => {
    mockService.findOne.mockResolvedValue(mockReward);
    const result = await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockReward);
  });

  it('should update reward', async () => {
    const updateDto: UpdateCustomerRewardsDto = { status: 'used' };
    mockService.update.mockResolvedValue({ ...mockReward, status: 'used' });
    const result = await controller.update('1', updateDto);
    expect(service.update).toHaveBeenCalledWith(1, updateDto);
    expect(result.status).toBe('used');
  });

  it('should delete reward', async () => {
    mockService.remove.mockResolvedValue({ affected: 1 });
    const result = await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual({ affected: 1 });
  });
});
