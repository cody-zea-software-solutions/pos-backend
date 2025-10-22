import { Test, TestingModule } from '@nestjs/testing';
import { SupplierPaymentsService } from './supplier-payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupplierPayment, SupplierPaymentStatus } from './supplier-payment.entity';
import { GoodsReceivedNote } from '../goods-received-notes/goods-received-note.entity';
import { ShopService } from '../../shop/shop.service';
import { SupplierService } from '../supplier/supplier.service';
import { UsersService } from '../../users/users.service';
import { Repository } from 'typeorm';

describe('SupplierPaymentsService', () => {
  let service: SupplierPaymentsService;
  let repo: Repository<SupplierPayment>;

  const mockPaymentRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockGrnRepo = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockShopService = { findOne: jest.fn() };
  const mockSupplierService = {
    findOne: jest.fn(),
    updateOutstandingAfterGrn: jest.fn(),
    saveSupplier: jest.fn(),
  };
  const mockUserService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierPaymentsService,
        { provide: getRepositoryToken(SupplierPayment), useValue: mockPaymentRepo },
        { provide: getRepositoryToken(GoodsReceivedNote), useValue: mockGrnRepo },
        { provide: ShopService, useValue: mockShopService },
        { provide: SupplierService, useValue: mockSupplierService },
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<SupplierPaymentsService>(SupplierPaymentsService);
    repo = module.get(getRepositoryToken(SupplierPayment));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create and save a supplier payment successfully', async () => {
      const dto = {
        shop_id: 1,
        supplier_id: 2,
        payment_amount: 500,
        payment_method: 'CASH',
        payment_date: new Date(),
      };

      mockShopService.findOne.mockResolvedValue({ shop_id: 1 });
      mockSupplierService.findOne.mockResolvedValue({ supplier_id: 2 });
      mockPaymentRepo.create.mockReturnValue(dto);
      mockPaymentRepo.save.mockResolvedValue({ payment_id: 1, ...dto });

      const result = await service.create(dto as any);
      expect(result.payment_id).toBe(1);
      expect(mockPaymentRepo.create).toHaveBeenCalled();
      expect(mockPaymentRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll()', () => {
    it('should return all payments', async () => {
      const payments = [{ payment_id: 1 }];
      mockPaymentRepo.find.mockResolvedValue(payments);
      const result = await service.findAll();
      expect(result).toEqual(payments);
    });
  });

  describe('findOne()', () => {
    it('should return a payment if found', async () => {
      const payment = { payment_id: 1 };
      mockPaymentRepo.findOne.mockResolvedValue(payment);
      const result = await service.findOne(1);
      expect(result).toEqual(payment);
    });

    it('should throw if payment not found', async () => {
      mockPaymentRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow('Payment #999 not found');
    });
  });

  describe('update()', () => {
    it('should update and save a payment', async () => {
      const payment = {
        payment_id: 1,
        payment_amount: 500,
        status: SupplierPaymentStatus.DRAFT,
        supplier: { supplier_id: 2 },
      };
      mockPaymentRepo.findOne.mockResolvedValue(payment);
      mockPaymentRepo.save.mockResolvedValue({ ...payment, payment_amount: 600 });

      const result = await service.update(1, { payment_amount: 600 });
      expect(result.payment_amount).toBe(600);
      expect(mockPaymentRepo.save).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should remove a payment', async () => {
      const payment = { payment_id: 1 };
      mockPaymentRepo.findOne.mockResolvedValue(payment);
      mockPaymentRepo.remove.mockResolvedValue(payment);

      await service.remove(1);
      expect(mockPaymentRepo.remove).toHaveBeenCalledWith(payment);
    });
  });
});
