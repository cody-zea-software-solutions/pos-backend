import { Test, TestingModule } from '@nestjs/testing';
import { BatchesService } from './batches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Batch } from './batches.entity';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { SupplierService } from '../supplier/supplier.service';
import { UsersService } from '../../users/users.service';
import { ConsignorService } from '../consignor/consignor.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('BatchesService', () => {
  let service: BatchesService;
  let batchRepo: Repository<Batch>;

  let productService: ProductService;
  let variationService: ProductVariationService;
  let supplierService: SupplierService;
  let userService: UsersService;
  let consignorService: ConsignorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchesService,
        {
          provide: getRepositoryToken(Batch),
          useClass: Repository,
        },
        { provide: ProductService, useValue: { findOne: jest.fn() } },
        { provide: ProductVariationService, useValue: { findOne: jest.fn() } },
        { provide: SupplierService, useValue: { findOne: jest.fn() } },
        { provide: UsersService, useValue: { findOne: jest.fn() } },
        { provide: ConsignorService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    service = module.get<BatchesService>(BatchesService);
    batchRepo = module.get(getRepositoryToken(Batch));
    productService = module.get(ProductService);
    variationService = module.get(ProductVariationService);
    supplierService = module.get(SupplierService);
    userService = module.get(UsersService);
    consignorService = module.get(ConsignorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateBatchDto = {
      batch_number: 'BATCH-001',
      product_id: 1,
      initial_quantity: 100,
      cost_price_per_unit: 10,
      selling_price_per_unit: 15,
      created_by_user: 1,
    };

    it('should throw ConflictException if batch number exists', async () => {
      jest.spyOn(batchRepo, 'findOne').mockResolvedValue({ batch_id: 1 } as Batch);
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should create a new batch successfully', async () => {
      jest.spyOn(batchRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(productService, 'findOne').mockResolvedValue({ product_id: 1 } as any);
      jest.spyOn(userService, 'findOne').mockResolvedValue({ user_id: 1 } as any);
      jest.spyOn(batchRepo, 'create').mockReturnValue({ batch_number: dto.batch_number } as any);
      jest.spyOn(batchRepo, 'save').mockResolvedValue({ batch_id: 1, batch_number: dto.batch_number } as Batch);

      const result = await service.create(dto);
      expect(result.batch_number).toBe('BATCH-001');
    });
  });

  describe('findAll', () => {
    it('should return all batches', async () => {
      const mockBatches = [{ batch_id: 1 }, { batch_id: 2 }] as Batch[];
      jest.spyOn(batchRepo, 'find').mockResolvedValue(mockBatches);

      const result = await service.findAll();
      expect(result).toEqual(mockBatches);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if batch not found', async () => {
      jest.spyOn(batchRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return batch if found', async () => {
      const mockBatch = { batch_id: 1 } as Batch;
      jest.spyOn(batchRepo, 'findOne').mockResolvedValue(mockBatch);

      const result = await service.findOne(1);
      expect(result).toEqual(mockBatch);
    });
  });

  describe('update', () => {
    it('should call save after updating', async () => {
      const mockBatch = { batch_id: 1 } as Batch;
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBatch);
      jest.spyOn(batchRepo, 'save').mockResolvedValue(mockBatch);

      const result = await service.update(1, { notes: 'Updated' });
      expect(batchRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockBatch);
    });
  });

  describe('remove', () => {
  it('should remove a batch', async () => {
    const mockBatch = { batch_id: 1 } as Batch;
    jest.spyOn(service, 'findOne').mockResolvedValue(mockBatch);
    jest.spyOn(batchRepo, 'remove').mockResolvedValue(mockBatch); // ✅ FIXED

    await service.remove(1);
    expect(batchRepo.remove).toHaveBeenCalledWith(mockBatch);
  });
});
});
