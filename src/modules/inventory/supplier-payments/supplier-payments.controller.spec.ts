import { Test, TestingModule } from '@nestjs/testing';
import { SupplierPaymentsController } from './supplier-payments.controller';
import { SupplierPaymentsService } from './supplier-payments.service';
import { CreateSupplierPaymentDto } from './dto/create-supplier-payment.dto';
import { UpdateSupplierPaymentDto } from './dto/update-supplier-payment.dto';

describe('SupplierPaymentsController', () => {
  let controller: SupplierPaymentsController;
  let service: SupplierPaymentsService;

  const mockPayment = {
    payment_id: 1,
    payment_number: 'PAY-123456',
    payment_date: new Date(),
    payment_amount: 1000,
    payment_method: 'CASH',
    status: 'PAID',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockPayment),
    findAll: jest.fn().mockResolvedValue([mockPayment]),
    findOne: jest.fn().mockResolvedValue(mockPayment),
    update: jest.fn().mockResolvedValue({ ...mockPayment, payment_amount: 2000 }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierPaymentsController],
      providers: [
        { provide: SupplierPaymentsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<SupplierPaymentsController>(SupplierPaymentsController);
    service = module.get<SupplierPaymentsService>(SupplierPaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a payment', async () => {
    const dto: CreateSupplierPaymentDto = {
      shop_id: 1,
      supplier_id: 1,
      payment_date: new Date(),
      payment_amount: 1000,
      payment_method: 'CASH' as any,
    };
    expect(await controller.create(dto)).toEqual(mockPayment);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should find all payments', async () => {
    expect(await controller.findAll()).toEqual([mockPayment]);
  });

  it('should find one payment by ID', async () => {
    expect(await controller.findOne(1)).toEqual(mockPayment);
  });

  it('should update a payment', async () => {
    const dto: UpdateSupplierPaymentDto = { payment_amount: 2000 };
    expect(await controller.update(1, dto)).toEqual({
      ...mockPayment,
      payment_amount: 2000,
    });
  });

  it('should remove a payment', async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
