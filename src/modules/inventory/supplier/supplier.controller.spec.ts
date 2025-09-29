import { Test, TestingModule } from '@nestjs/testing';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

describe('SupplierController', () => {
  let controller: SupplierController;
  let service: SupplierService;

  const mockSupplierService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        {
          provide: SupplierService,
          useValue: mockSupplierService,
        },
      ],
    }).compile();

    controller = module.get<SupplierController>(SupplierController);
    service = module.get<SupplierService>(SupplierService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct data', async () => {
      const dto: CreateSupplierDto = {
        supplier_name: 'ABC Supplies',
        supplier_code: 'SUP001',
      } as CreateSupplierDto;

      mockSupplierService.create.mockResolvedValue(dto);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of suppliers', async () => {
      const suppliers = [{ supplier_id: 1, supplier_name: 'Test' }];
      mockSupplierService.findAll.mockResolvedValue(suppliers);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(suppliers);
    });
  });

  describe('findOne', () => {
    it('should return a supplier by id', async () => {
      const supplier = { supplier_id: 1, supplier_name: 'Test' };
      mockSupplierService.findOne.mockResolvedValue(supplier);

      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(supplier);
    });
  });

  describe('update', () => {
    it('should update supplier by id', async () => {
      const dto: UpdateSupplierDto = { supplier_name: 'Updated Supplier' };
      const updatedSupplier = { supplier_id: 1, supplier_name: 'Updated Supplier' };

      mockSupplierService.update.mockResolvedValue(updatedSupplier);

      const result = await controller.update(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updatedSupplier);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      mockSupplierService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
