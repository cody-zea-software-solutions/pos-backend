import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CustomerService', () => {
  let service: CustomerService;
  let repo: Repository<Customer>;

  const mockCustomerRepo = {
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
        { provide: getRepositoryToken(Customer), useValue: mockCustomerRepo },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repo = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const dto = {
        qr_code: 'QR123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        gender: 'Other',
      };

      const mockCustomer = { ...dto, customer_id: 1 };
      mockCustomerRepo.create.mockReturnValue(mockCustomer);
      mockCustomerRepo.save.mockResolvedValue(mockCustomer);

      expect(await service.create(dto as any)).toEqual(mockCustomer);
      expect(mockCustomerRepo.create).toHaveBeenCalledWith({
        ...dto,
        birth_date: null,
        last_scan: null,
      });
    });
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      const result = [];
      mockCustomerRepo.find.mockResolvedValue(result);
      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a customer by id', async () => {
      const result = { customer_id: 1 };
      mockCustomerRepo.findOne.mockResolvedValue(result);
      expect(await service.findOne(1)).toEqual(result);
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockCustomerRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const existingCustomer = { customer_id: 1, qr_code: 'QR123' };
      const dto = { first_name: 'Jane' };

      mockCustomerRepo.findOne.mockResolvedValue(existingCustomer);
      mockCustomerRepo.update.mockResolvedValue({});
      mockCustomerRepo.findOne.mockResolvedValue({ ...existingCustomer, ...dto });

      const result = await service.update(1, dto as any);
      expect(result.first_name).toEqual('Jane');
    });
  });

  describe('remove', () => {
    it('should delete a customer', async () => {
      mockCustomerRepo.delete.mockResolvedValue({ affected: 1 });
      await service.remove(1);
      expect(mockCustomerRepo.delete).toHaveBeenCalledWith({ customer_id: 1 });
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockCustomerRepo.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
