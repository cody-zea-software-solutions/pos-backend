import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { LoyaltyLevel } from '../loyalty-levels/loyalty-levels.entity';
import { Shop } from '../../shop/shop.entity';
import { Counter } from '../../counter/counter.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Gender, CustomerType } from './customer.entity';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepo: jest.Mocked<Repository<Customer>>;
  let shopRepo: jest.Mocked<Repository<Shop>>;
  let counterRepo: jest.Mocked<Repository<Counter>>;
  let levelRepo: jest.Mocked<Repository<LoyaltyLevel>>;

  const mockCustomer: Customer = {
    customer_id: 1,
    qr_code: 'QR001',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
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

  const mockRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: getRepositoryToken(Customer), useFactory: mockRepository },
        { provide: getRepositoryToken(Shop), useFactory: mockRepository },
        { provide: getRepositoryToken(Counter), useFactory: mockRepository },
        { provide: getRepositoryToken(LoyaltyLevel), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepo = module.get(getRepositoryToken(Customer)) as jest.Mocked<Repository<Customer>>;
    shopRepo = module.get(getRepositoryToken(Shop)) as jest.Mocked<Repository<Shop>>;
    counterRepo = module.get(getRepositoryToken(Counter)) as jest.Mocked<Repository<Counter>>;
    levelRepo = module.get(getRepositoryToken(LoyaltyLevel)) as jest.Mocked<Repository<LoyaltyLevel>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should throw ConflictException if QR already exists', async () => {
      customerRepo.findOne.mockResolvedValue(mockCustomer);
      await expect(
        service.create({
          qr_code: 'QR001',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          preferred_shop: 1,
        } as CreateCustomerDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should create a customer successfully', async () => {
      customerRepo.findOne.mockResolvedValueOnce(null); // no existing QR
      customerRepo.findOne.mockResolvedValueOnce(null); // no existing email
      shopRepo.findOne.mockResolvedValue({ shop_id: 1 } as Shop);
      customerRepo.create.mockReturnValue(mockCustomer);
      customerRepo.save.mockResolvedValue(mockCustomer);

      const dto: CreateCustomerDto = {
        qr_code: 'QR002',
        first_name: 'avis',
        last_name: 'rodri',
        email: 'avise@example.com',
        phone: '9876543210',
        preferred_shop: 1,
      };
      const result = await service.create(dto);
      expect(result).toEqual(mockCustomer);
      expect(customerRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll()', () => {
    it('should return all customers', async () => {
      customerRepo.find.mockResolvedValue([mockCustomer]);
      expect(await service.findAll()).toEqual([mockCustomer]);
    });
  });

  describe('findOne()', () => {
    it('should return one customer', async () => {
      customerRepo.findOne.mockResolvedValue(mockCustomer);
      expect(await service.findOne(1)).toEqual(mockCustomer);
    });

    it('should throw NotFoundException if not found', async () => {
      customerRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('should remove a customer', async () => {
      customerRepo.remove.mockResolvedValue(mockCustomer);
await service.remove(1);
expect(customerRepo.remove).toHaveBeenCalledWith(mockCustomer);
    });
  });
});
