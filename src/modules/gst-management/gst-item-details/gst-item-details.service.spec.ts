import { Test, TestingModule } from '@nestjs/testing';
import { GstItemDetailsService } from './gst-item-details.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GstItemDetail } from './gst-item-details.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

// MockRepository type with ObjectLiteral constraint
type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

// Create a mock repository function
const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('GstItemDetailsService', () => {
  let service: GstItemDetailsService;
  let repo: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GstItemDetailsService,
        { provide: getRepositoryToken(GstItemDetail), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<GstItemDetailsService>(GstItemDetailsService);
    repo = module.get<MockRepository>(getRepositoryToken(GstItemDetail));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a GST item', async () => {
      const dto = {
        gst_transaction_id: 1,
        transaction_item_id: 1,
        product_id: 1,
        hsn_code: '1234',
        quantity: 1,
        unit_price: 100,
        discount_amount: 0,
        taxable_value: 100,
        cgst_rate: 5,
        sgst_rate: 5,
        igst_rate: 0,
        cess_rate: 0,
        cgst_amount: 5,
        sgst_amount: 5,
        igst_amount: 0,
        cess_amount: 0,
        total_tax_amount: 10,
      };

      const created = { ...dto, gst_item_id: 1 };
      repo.create!.mockReturnValue(created);
      repo.save!.mockResolvedValue(created);

      expect(await service.create(dto)).toEqual(created);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(created);
    });
  });

  describe('findAll', () => {
    it('should return all GST items', async () => {
      const items = [{ gst_item_id: 1 }];
      repo.find!.mockResolvedValue(items);
      expect(await service.findAll()).toEqual(items);
    });
  });

  describe('findOne', () => {
    it('should return a GST item if found', async () => {
      const item = { gst_item_id: 1 };
      repo.findOne!.mockResolvedValue(item);
      expect(await service.findOne(1)).toEqual(item);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne!.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the updated item', async () => {
      const existing = { gst_item_id: 1, gst_transaction_id: 1 };
      const dto = { gst_transaction_id: 2 };
      const updated = { ...existing, ...dto };

      service.findOne = jest.fn().mockResolvedValue(existing);
      repo.update!.mockResolvedValue({ affected: 1 });
      service.findOne = jest.fn().mockResolvedValue(updated);

      expect(await service.update(1, dto)).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove the GST item', async () => {
      repo.delete!.mockResolvedValue({ affected: 1 });
      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if item not found', async () => {
      repo.delete!.mockResolvedValue({ affected: 0 });
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
