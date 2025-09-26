import { Test, TestingModule } from '@nestjs/testing';
import { CounterService } from './counter.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Counter } from './counter.entity';
import { Repository } from 'typeorm';
import { ShopService } from '../shop/shop.service';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';
import { CreateCounterDto } from './dto/create-counter.dto';
import { UpdateCounterDto } from './dto/update-counter.dto';
import { User } from '../users/user.entity';

describe('CounterService', () => {
  let service: CounterService;
  let repo: Repository<Counter>;
  let shopService: ShopService;
  let usersService: UsersService;

  const mockCounter: Counter = {
    counter_id: 1,
    shop: { shop_id: 1 } as any,
    counter_name: 'Main Counter',
    counter_code: 'C001',
    counter_type: 'POS',
    has_cash_drawer: false,
    printer_config: '',
    hardware_config: '',
    is_active: true,
    created_at: new Date(),
    current_user: { user_id: 0 } as User,
    status: 'CLOSED',
    opening_cash_balance: 0,
    current_cash_balance: 0,
    rollback_balance: 0,
    last_rollback: new Date(),
    rollback_by_user: { user_id: 0 } as User,
    enable_gst_printing: false,
    shifts: [],
    loyaltyPoints: [],
    customerRewards: [],
    promotions: [],    
  transactions: [],   
  refunds: [], 
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockCounter),
    save: jest.fn().mockResolvedValue(mockCounter),
    find: jest.fn().mockResolvedValue([mockCounter]),
    findOne: jest.fn().mockResolvedValue(mockCounter),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  const mockShopService = {
    findOne: jest.fn().mockResolvedValue({ shop_id: 1 }),
  };

  const mockUsersService = {
    findOne: jest.fn().mockResolvedValue({ user_id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CounterService,
        { provide: getRepositoryToken(Counter), useValue: mockRepository },
        { provide: ShopService, useValue: mockShopService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<CounterService>(CounterService);
    repo = module.get<Repository<Counter>>(getRepositoryToken(Counter));
    shopService = module.get<ShopService>(ShopService);
    usersService = module.get<UsersService>(UsersService);

    // Reset mocks before each test to prevent side-effects
    jest.clearAllMocks();
    mockRepository.findOne.mockResolvedValue(mockCounter);
    mockRepository.find.mockResolvedValue([mockCounter]);
    mockRepository.save.mockResolvedValue(mockCounter);
    mockRepository.create.mockReturnValue(mockCounter);
    mockRepository.remove.mockResolvedValue(undefined);
    mockShopService.findOne.mockResolvedValue({ shop_id: 1 });
    mockUsersService.findOne.mockResolvedValue({ user_id: 1 });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a counter', async () => {
      const dto: CreateCounterDto = {
        shop: 1,
        counter_name: 'Main Counter',
        counter_code: 'C001',
        counter_type: 'POS',
      };

      const result = await service.create(dto);

      expect(shopService.findOne).toHaveBeenCalledWith(1);
      expect(repo.create).toHaveBeenCalledWith({
        counter_name: dto.counter_name,
        counter_code: dto.counter_code,
        counter_type: dto.counter_type,
      });
      expect(repo.save).toHaveBeenCalledWith(mockCounter);
      expect(result).toEqual(mockCounter);
    });

    it('should throw if shop not found', async () => {
      mockShopService.findOne.mockResolvedValueOnce(null);

      const dto: CreateCounterDto = {
        shop: 99,
        counter_name: 'Main Counter',
        counter_code: 'C001',
        counter_type: 'POS',
      };

      await expect(service.create(dto)).rejects.toThrow(
        new NotFoundException(`Shop with ID ${dto.shop} not found`),
      );
    });
  });

  it('should return all counters', async () => {
    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalledWith({
      relations: ['shop', 'current_user', 'rollback_by_user'],
    });
    expect(result).toEqual([mockCounter]);
  });

  it('should return one counter by id', async () => {
    const result = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { counter_id: 1 },
      relations: ['shop', 'current_user', 'rollback_by_user'],
    });
    expect(result).toEqual(mockCounter);
  });

  it('should throw if counter not found', async () => {
    mockRepository.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne(1)).rejects.toThrow(
      new NotFoundException(`Counter with ID 1 not found`),
    );
  });

  it('should update a counter', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockCounter);
    const dto: UpdateCounterDto = { counter_name: 'Updated Counter' };
    const result = await service.update(1, dto);
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(mockCounter);
  });

  it('should remove a counter', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockCounter);
    await service.remove(1);
    expect(repo.remove).toHaveBeenCalledWith(mockCounter);
  });

  it('should find by counter code', async () => {
    mockRepository.findOne.mockResolvedValueOnce(mockCounter); // ensure correct value
    const result = await service.findByCode('C001');
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { counter_code: 'C001' },
      relations: ['shop', 'current_user'],
    });
    expect(result).toEqual(mockCounter);
  });
});
