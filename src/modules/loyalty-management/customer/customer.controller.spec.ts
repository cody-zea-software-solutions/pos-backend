import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './customer.entity';
import { Gender, CustomerType } from './customer.entity'; 
describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  const mockCustomer: Customer = {
    customer_id: 1,
    qr_code: 'QR001',
    first_name: 'avis',
    last_name: 'rodri',
    email: 'avise@example.com',
    phone: '9876543210',
    birth_date: null,
    gender: Gender.MALE, 
    address: null,
    city: 'Cityville',
    postal_code: '12345',
    gst_number: 'GST123',
     customer_type: CustomerType.INDIVIDUAL,
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
    total_points: 100,
    last_scan: null,
    total_visits: 5,
    available_points: 50,
    total_spent: 1000,
    current_level_id: undefined,
    preferred_shop: undefined,
    preferred_counter: undefined,
    loyaltyPoints: [],
    customerRewards: [],
    transactions: [],
    refunds: [],
    gift_cards: [],
  };

  const mockCustomerService = {
    create: jest.fn().mockResolvedValue(mockCustomer),
    findAll: jest.fn().mockResolvedValue([mockCustomer]),
    findOne: jest.fn().mockResolvedValue(mockCustomer),
    update: jest.fn().mockResolvedValue({ ...mockCustomer, first_name: 'Updated' }),
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
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      preferred_shop: 1,
    };
    expect(await controller.create(dto)).toEqual(mockCustomer);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all customers', async () => {
    expect(await controller.findAll()).toEqual([mockCustomer]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a customer by ID', async () => {
    expect(await controller.findOne('1')).toEqual(mockCustomer);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a customer', async () => {
    const dto: UpdateCustomerDto = { first_name: 'Updated' };
    expect(await controller.update('1', dto)).toEqual({
      ...mockCustomer,
      first_name: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a customer', async () => {
    await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
