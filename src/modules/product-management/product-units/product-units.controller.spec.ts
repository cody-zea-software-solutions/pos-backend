import { Test, TestingModule } from '@nestjs/testing';
import { ProductUnitsController } from './product-units.controller';
import { ProductUnitsService } from './product-units.service';
import { ProductUnit } from './product-unit.entity';

describe('ProductUnitsController', () => {
  let controller: ProductUnitsController;
  let service: ProductUnitsService;

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

  const mockService = {
    create: jest.fn().mockResolvedValue(mockUnit),
    findAll: jest.fn().mockResolvedValue([mockUnit]),
    findOne: jest.fn().mockResolvedValue(mockUnit),
    update: jest.fn().mockResolvedValue({ ...mockUnit, unit_name: 'Gram' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductUnitsController],
      providers: [{ provide: ProductUnitsService, useValue: mockService }],
    }).compile();

    controller = module.get<ProductUnitsController>(ProductUnitsController);
    service = module.get<ProductUnitsService>(ProductUnitsService);
  });

  it('should create unit', async () => {
    const result = await controller.create({ unit_name: 'Kilogram', unit_type: 'WEIGHT' } as any);
    expect(result).toEqual(mockUnit);
    expect(mockService.create).toHaveBeenCalled();
  });

  it('should return all units', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockUnit]);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should return one unit', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockUnit);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('should update unit', async () => {
    const result = await controller.update(1, { unit_name: 'Gram' } as any);
    expect(result.unit_name).toEqual('Gram');
    expect(mockService.update).toHaveBeenCalledWith(1, { unit_name: 'Gram' });
  });

  it('should remove unit', async () => {
    const result = await controller.remove(1);
    expect(result).toBeUndefined();
    expect(mockService.remove).toHaveBeenCalledWith(1);
  });
});
