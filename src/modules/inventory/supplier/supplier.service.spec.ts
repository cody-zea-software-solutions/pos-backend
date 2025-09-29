import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from './supplier.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('SupplierService', () => {
  let service: SupplierService;
  let repo: Repository<Supplier>;

  const mockSupplier = {
    supplier_id: 1,
    supplier_name: 'Test Supplier',
    supplier_code: 'SUP001',
  } as Supplier;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
    repo = module.get<Repository<Supplier>>(getRepositoryToken(Supplier));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if supplier_code exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockSupplier);

      await expect(service.create(mockSupplier)).rejects.toThrow(ConflictException);
    });

    it('should save a new supplier if code is unique', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockSupplier);
      mockRepository.save.mockResolvedValue(mockSupplier);

      const result = await service.create(mockSupplier);
      expect(result).toEqual(mockSupplier);
    });
  });

  describe('findAll', () => {
    it('should return all suppliers', async () => {
      mockRepository.find.mockResolvedValue([mockSupplier]);
      const result = await service.findAll();
      expect(result).toEqual([mockSupplier]);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if supplier not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return supplier if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockSupplier);

      const result = await service.findOne(1);
      expect(result).toEqual(mockSupplier);
    });
  });

  describe('update', () => {
    it('should throw ConflictException if code already exists', async () => {
      mockRepository.findOne
        .mockResolvedValueOnce(mockSupplier) // for findOne
        .mockResolvedValueOnce({ supplier_id: 2, supplier_code: 'SUP002' }); // for code check

      await expect(service.update(1, { supplier_code: 'SUP002' })).rejects.toThrow(ConflictException);
    });

    it('should update and save supplier', async () => {
      mockRepository.findOne.mockResolvedValue(mockSupplier);
      mockRepository.save.mockResolvedValue({ ...mockSupplier, supplier_name: 'Updated' });

      const result = await service.update(1, { supplier_name: 'Updated' });
      expect(result.supplier_name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should remove supplier', async () => {
      mockRepository.findOne.mockResolvedValue(mockSupplier);
      mockRepository.remove.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.not.toThrow();
      expect(mockRepository.remove).toHaveBeenCalledWith(mockSupplier);
    });
  });
});
