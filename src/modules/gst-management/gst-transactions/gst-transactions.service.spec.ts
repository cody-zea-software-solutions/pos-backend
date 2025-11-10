import { Test, TestingModule } from '@nestjs/testing';
import { GstTransactionsService } from './gst-transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GstTransaction, TransactionType, GstTreatment, InvoiceType } from './gst-transactions.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('GstTransactionsService', () => {
  let service: GstTransactionsService;
  let repo: jest.Mocked<Repository<GstTransaction>>;

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
    supplier_gst_number: '29BBBBB1111B2Z6',
    supplier_state: 'Tamil Nadu',
    is_interstate: false,
    is_reverse_charge: false,
     transaction_date: new Date('2024-11-01'),
    invoice_type: InvoiceType.B2B,
  } as GstTransaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GstTransactionsService,
        {
          provide: getRepositoryToken(GstTransaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GstTransactionsService>(GstTransactionsService);
    repo = module.get(getRepositoryToken(GstTransaction));
  });

  describe('create', () => {
    it('should create and save a GST transaction', async () => {
      repo.create.mockReturnValue(mockTransaction);
      repo.save.mockResolvedValue(mockTransaction);

      const result = await service.create(mockTransaction);

      expect(repo.create).toHaveBeenCalledWith(mockTransaction);
      expect(repo.save).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('findAll', () => {
    it('should return all GST transactions', async () => {
      repo.find.mockResolvedValue([mockTransaction]);
      const result = await service.findAll();
      expect(result).toEqual([mockTransaction]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a transaction if found', async () => {
      repo.findOne.mockResolvedValue(mockTransaction);
      const result = await service.findOne(1);
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an existing GST transaction', async () => {
      repo.findOne.mockResolvedValueOnce(mockTransaction);
      repo.update.mockResolvedValue({ affected: 1 } as any);
      repo.findOne.mockResolvedValueOnce({
        ...mockTransaction,
        taxable_amount: 2000,
      });

      const result = await service.update(1, { taxable_amount: 2000 });
      expect(result.taxable_amount).toBe(2000);
      expect(repo.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a GST transaction', async () => {
      repo.delete.mockResolvedValue({ affected: 1 } as any);
      await expect(service.remove(1)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if record not found', async () => {
      repo.delete.mockResolvedValue({ affected: 0 } as any);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
