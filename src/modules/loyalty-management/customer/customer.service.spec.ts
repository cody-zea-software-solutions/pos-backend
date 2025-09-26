import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, Gender, CustomerType } from './customer.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomerService', () => {
  let service: CustomerService;
  let repo: Repository<Customer>;

  const dto: CreateCustomerDto = {
    qr_code: 'QR005',
    first_name: 'jackson',
    last_name: 'perera',
    email: 'jackson@example.com',
    phone: '1234567890',
    birth_date: '2000-01-01',
  };

  const mockCustomer: Customer = {
    customer_id: 1,
    qr_code: dto.qr_code,
    first_name: dto.first_name,
    last_name: dto.last_name,
    email: dto.email,
    phone: dto.phone,
    birth_date: dto.birth_date ? new Date(dto.birth_date) : null,
    gender: Gender.OTHER,
    address: '',
    city: '',
    postal_code: '',
    gst_number: '',
    customer_type: CustomerType.INDIVIDUAL,
    is_active: true,
    total_points: 0,
    current_level: 0,
    last_scan: dto.last_scan ? new Date(dto.last_scan) : null,
    preferred_shop: '',
    preferred_counter: '',
    total_visits: 0,
    total_spent: 0,
    created_at: new Date(),
    updated_at: new Date(),
    loyaltyPoints: [],
    customerRewards: [],
    transactions: [],  
  refunds: [],      
  };

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repo = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a customer', async () => {
    mockRepo.create.mockReturnValue(mockCustomer);
    mockRepo.save.mockResolvedValue(mockCustomer);

    const result = await service.create(dto);

    expect(mockRepo.create).toHaveBeenCalledWith({
      ...dto,
      birth_date: dto.birth_date ? new Date(dto.birth_date) : null,
      last_scan: null,
    });
    expect(mockRepo.save).toHaveBeenCalledWith(mockCustomer);
    expect(result).toEqual(mockCustomer);
  });

  it('should find all customers', async () => {
    mockRepo.find.mockResolvedValue([mockCustomer]);
    const result = await service.findAll();
    expect(mockRepo.find).toHaveBeenCalled();
    expect(result).toEqual([mockCustomer]);
  });

  it('should find one customer by id', async () => {
    mockRepo.findOne.mockResolvedValue(mockCustomer);
    const result = await service.findOne(1);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { customer_id: 1 } });
    expect(result).toEqual(mockCustomer);
  });

  it('should throw NotFoundException if customer not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should find a customer by QR code', async () => {
    mockRepo.findOne.mockResolvedValue(mockCustomer);
    const result = await service.findByQRCode('QR001');
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { qr_code: 'QR001' } });
    expect(result).toEqual(mockCustomer);
  });

  it('should update a customer', async () => {
    const updateDto: UpdateCustomerDto = { first_name: 'Jane' };

    // first call -> before update
    mockRepo.findOne
      .mockResolvedValueOnce(mockCustomer)
      // second call -> after update, return updated object
      .mockResolvedValueOnce({ ...mockCustomer, first_name: 'Jane' });

    mockRepo.update.mockResolvedValue({ affected: 1 });

    const result = await service.update(1, updateDto);

    expect(mockRepo.update).toHaveBeenCalledWith(
      { customer_id: 1 },
      expect.objectContaining({ first_name: 'Jane' }),
    );
    expect(result.first_name).toBe('Jane');
  });

  it('should remove a customer', async () => {
    mockRepo.delete.mockResolvedValue({ affected: 1 });
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(mockRepo.delete).toHaveBeenCalledWith({ customer_id: 1 });
  });

  it('should throw NotFoundException when removing non-existent customer', async () => {
    mockRepo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
