import { Test, TestingModule } from '@nestjs/testing';
import { GstTransactionsController } from './gst-transactions.controller';
import { GstTransactionsService } from './gst-transactions.service';
import { GstTransaction, TransactionType, GstTreatment, InvoiceType } from './gst-transactions.entity';

describe('GstTransactionsController', () => {
  let controller: GstTransactionsController;
  let service: jest.Mocked<GstTransactionsService>;

  const mockTransaction: GstTransaction = {
  gst_transaction_id: 1,
  transaction_id: 1001,
  transaction_type: TransactionType.SALE,
  gst_treatment: GstTreatment.TAXABLE,
  taxable_amount: 1000,
  cgst_amount: 90,
  sgst_amount: 90,
  igst_amount: 0,
  cess_amount: 0,
  total_gst_amount: 180,
  customer_gst_number: '22AAAAA0000A1Z5',
  customer_state: 'Karnataka',
  supplier_gst_number: '33BBBBB0000B1Z6',
  supplier_state: 'Tamil Nadu',
  is_interstate: true,
  is_reverse_charge: false,
  transaction_date: new Date('2024-11-01'), // 
  invoice_type: InvoiceType.B2B,
};


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GstTransactionsController],
      providers: [
        {
          provide: GstTransactionsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GstTransactionsController>(GstTransactionsController);
    service = module.get(GstTransactionsService);
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      service.create.mockResolvedValue(mockTransaction);
      const result = await controller.create(mockTransaction);
      expect(service.create).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('findAll', () => {
    it('should return all GST transactions', async () => {
      service.findAll.mockResolvedValue([mockTransaction]);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockTransaction]);
    });
  });

  describe('findOne', () => {
    it('should return one GST transaction', async () => {
      service.findOne.mockResolvedValue(mockTransaction);
      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('update', () => {
    it('should update and return the transaction', async () => {
      const updated = { ...mockTransaction, taxable_amount: 2000 };
      service.update.mockResolvedValue(updated);
      const result = await controller.update(1, { taxable_amount: 2000 });
      expect(service.update).toHaveBeenCalledWith(1, { taxable_amount: 2000 });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      service.remove.mockResolvedValue(undefined);
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
