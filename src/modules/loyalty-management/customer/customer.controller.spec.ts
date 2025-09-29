import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, Gender, CustomerType } from './customer.entity';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  const mockCustomer: Customer = {
    customer_id: 1,
    qr_code: 'QR001',
    first_name: 'Jackson',
    last_name: 'Perera',
    email: 'jackson@example.com',
    phone: '1234567890',
    birth_date: new Date('2000-01-01'),
    gender: Gender.OTHER,
    address: '',
    city: '',
    postal_code: '',
    gst_number: '',
    customer_type: CustomerType.INDIVIDUAL,
    is_active: true,
    total_points: 0,
    current_level: 0,
    last_scan: null,
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
  gift_cards: [],  
  };

  const mockCustomerService = {
    create: jest.fn().mockResolvedValue(mockCustomer),
    findAll: jest.fn().mockResolvedValue([mockCustomer]),
    findByQRCode: jest.fn().mockResolvedValue(mockCustomer),
    findOne: jest.fn().mockResolvedValue(mockCustomer),
    update: jest.fn().mockResolvedValue({ ...mockCustomer, first_name: 'Jane' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a customer', async () => {
    const dto: CreateCustomerDto = {
      qr_code: 'QR001',
      first_name: 'Jackson',
      last_name: 'Perera',
      email: 'jackson@example.com',
      phone: '1234567890',
      birth_date: '2000-01-01',
    };
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockCustomer);
  });

  it('should list all customers', async () => {
    const result = await controller.list();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockCustomer]);
  });

  it('should search customer by QR code', async () => {
    const result = await controller.list('QR001');
    expect(service.findByQRCode).toHaveBeenCalledWith('QR001');
    expect(result).toEqual(mockCustomer);
  });

  it('should return one customer', async () => {
    const result = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockCustomer);
  });

  it('should update a customer', async () => {
    const updateDto: UpdateCustomerDto = { first_name: 'Jane' };
    const result = await controller.update(1, updateDto);
    expect(service.update).toHaveBeenCalledWith(1, updateDto);
    expect(result.first_name).toBe('Jane');
  });

  it('should remove a customer', async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
