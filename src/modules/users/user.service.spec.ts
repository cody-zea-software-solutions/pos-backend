import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ShopService } from '../shop/shop.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;
  let shopService: ShopService;

  const mockUser: User = {
    user_id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    password_hash: 'hashedPassword',
    first_name: 'John',
    last_name: 'Doe',
    phone: '1234567890',
    role: 'admin',
    assigned_shop: { shop_id: 1 } as any,
    permissions: '',
    is_active: true,
    created_at: new Date(),
    last_login: new Date(),
    status: 'OFFLINE',
    can_approve_refunds: false,
    refund_approval_limit: 0,
    can_rollback_cash: false,
    rollback_limit: 0,
    can_manage_pricing: false,
    can_manage_gst: false,
    can_create_batches: false,
    current_counters: [],
    rollback_counters: [],
    shifts: [],
    createdLoyaltyPoints: [],
    processedRewards: [],
    promotions: [],           
  transactions: [],         
  processed_refunds: [],    
  authorized_refunds: [],   
  refund_approvals: [], 
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  const mockShopService = {
    findOne: jest.fn().mockResolvedValue({ shop_id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
        { provide: ShopService, useValue: mockShopService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    shopService = module.get<ShopService>(ShopService);

    jest.clearAllMocks();
    // Default findOne returns user unless overridden in tests
    mockRepository.findOne.mockResolvedValue(mockUser);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const dto: CreateUserDto = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'admin',
        assigned_shop_id: 1,
      };

      // username/email must not exist
      mockRepository.findOne
        .mockResolvedValueOnce(null) // username check
        .mockResolvedValueOnce(null); // email check

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if username exists', async () => {
      const dto: CreateUserDto = {
        username: 'john_doe',
        email: 'john2@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'admin',
        assigned_shop_id: 1,
      };

      // username already exists
      mockRepository.findOne.mockResolvedValueOnce(mockUser);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if email exists', async () => {
      const dto: CreateUserDto = {
        username: 'john_new',
        email: 'john@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'admin',
        assigned_shop_id: 1,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(null) // username check
        .mockResolvedValueOnce(mockUser); // email exists

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if shop not found', async () => {
      const dto: CreateUserDto = {
        username: 'new_user',
        email: 'new@example.com',
        password: 'password123',
        first_name: 'Jane',
        last_name: 'Doe',
        role: 'admin',
        assigned_shop_id: 99,
      };

      // username/email checks pass
      mockRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      mockShopService.findOne.mockResolvedValueOnce(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  it('should return all users', async () => {
    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalledWith({ relations: ['assigned_shop'] });
    expect(result).toEqual([mockUser]);
  });

  it('should return one user by id', async () => {
    const result = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { user_id: 1 },
      relations: ['assigned_shop'],
    });
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found', async () => {
    mockRepository.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

    const dto: UpdateUserDto = { first_name: 'Jane', assigned_shop_id: 1 };

    const result = await service.update(1, dto);
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('should remove a user', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
    await service.remove(1);
    expect(repo.remove).toHaveBeenCalledWith(mockUser);
  });

  it('should find user by username', async () => {
    const result = await service.findByUsername('john_doe');
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { username: 'john_doe' },
      relations: ['assigned_shop'],
    });
    expect(result).toEqual(mockUser);
  });
});
