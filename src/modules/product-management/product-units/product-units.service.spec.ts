import { Test, TestingModule } from '@nestjs/testing';
import { ProductUnitsService } from './product-units.service';
import { ProductUnit } from './product-unit.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductUnitsService', () => {
  let service: ProductUnitsService;
  let repo: jest.Mocked<Repository<ProductUnit>>;

  const mockUnit: ProductUnit = {
    unit_id: 1,
    unit_name: 'Kilogram',
    unit_symbol: 'kg',
    unit_type: 'WEIGHT',
    base_unit_conversion: 1,
    is_base_unit: true,
    is_active: true,
    created_at: new Date(),
    products: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductUnitsService,
        {
          provide: getRepositoryToken(ProductUnit),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductUnitsService>(ProductUnitsService);
    repo = module.get(getRepositoryToken(ProductUnit));
  });

  describe('create', () => {
    it('should throw conflict if unit exists', async () => {
      repo.findOne.mockResolvedValue(mockUnit);
      await expect(
        service.create({ unit_name: 'Kilogram', unit_type: 'WEIGHT' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should create and save unit', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(mockUnit);
      repo.save.mockResolvedValue(mockUnit);

      const result = await service.create({ unit_name: 'Kilogram', unit_type: 'WEIGHT' } as any);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockUnit);
    });
  });

  describe('findAll', () => {
    it('should return all units', async () => {
      repo.find.mockResolvedValue([mockUnit]);
      const result = await service.findAll();
      expect(result).toEqual([mockUnit]);
    });
  });

  describe('findOne', () => {
    it('should throw not found if missing', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return unit', async () => {
      repo.findOne.mockResolvedValue(mockUnit);
      const result = await service.findOne(1);
      expect(result).toEqual(mockUnit);
    });
  });

  describe('update', () => {
  it('should throw conflict if unit_name exists', async () => {
    // Current unit (found by ID)
    repo.findOne
      .mockResolvedValueOnce(mockUnit) // current unit (Kilogram)
      .mockResolvedValueOnce(mockUnit); // duplicate with same name (Gram exists)

    await expect(
      service.update(1, { unit_name: 'Gram' } as any),
    ).rejects.toThrow(ConflictException);
  });

  it('should update and save unit', async () => {
    repo.findOne.mockResolvedValueOnce(mockUnit).mockResolvedValueOnce(null);
    repo.save.mockResolvedValue({ ...mockUnit, unit_name: 'Gram' });

    const result = await service.update(1, { unit_name: 'Gram' } as any);
    expect(result.unit_name).toEqual('Gram');
    expect(repo.save).toHaveBeenCalled();
  });
});

  describe('remove', () => {
    it('should remove unit', async () => {
      repo.findOne.mockResolvedValue(mockUnit);
      repo.remove.mockResolvedValue(mockUnit);

      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockUnit);
    });
  });
});
