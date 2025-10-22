import { Test, TestingModule } from '@nestjs/testing';
import { SupplierOutstandingsController } from './supplier-outstandings.controller';
import { SupplierOutstandingsService } from './supplier-outstandings.service';
import { SupplierOutstandingStatus } from './supplier-outstanding.entity';

describe('SupplierOutstandingsController', () => {
  let controller: SupplierOutstandingsController;
  let service: SupplierOutstandingsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findBySupplier: jest.fn(),
  };

  const mockOutstanding = {
    outstanding_id: 1,
    total_amount: 1000,
    paid_amount: 200,
    balance_amount: 800,
    status: SupplierOutstandingStatus.PENDING,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierOutstandingsController],
      providers: [
        {
          provide: SupplierOutstandingsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SupplierOutstandingsController>(SupplierOutstandingsController);
    service = module.get<SupplierOutstandingsService>(SupplierOutstandingsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ---------------------------
  // CREATE
  // ---------------------------
  it('should create a new supplier outstanding', async () => {
    mockService.create.mockResolvedValue(mockOutstanding);
    const dto = { shop_id: 1, supplier_id: 2, total_amount: 1000 };
    const result = await controller.create(dto as any);
    expect(result).toEqual(mockOutstanding);
    expect(mockService.create).toHaveBeenCalled();
  });

  // ---------------------------
  // FIND ALL
  // ---------------------------
  it('should return all outstandings', async () => {
    mockService.findAll.mockResolvedValue([mockOutstanding]);
    const result = await controller.findAll();
    expect(result).toEqual([mockOutstanding]);
  });

  // ---------------------------
  // FIND ONE
  // ---------------------------
  it('should return one outstanding by ID', async () => {
    mockService.findOne.mockResolvedValue(mockOutstanding);
    const result = await controller.findOne(1);
    expect(result).toEqual(mockOutstanding);
  });

  // ---------------------------
  // UPDATE
  // ---------------------------
  it('should update an outstanding', async () => {
    mockService.update.mockResolvedValue(mockOutstanding);
    const dto = { paid_amount: 500 };
    const result = await controller.update(1, dto as any);
    expect(result).toEqual(mockOutstanding);
  });

  // ---------------------------
  // REMOVE
  // ---------------------------
  it('should remove an outstanding', async () => {
    mockService.remove.mockResolvedValue(undefined);
    await controller.remove(1);
    expect(mockService.remove).toHaveBeenCalledWith(1);
  });

  // ---------------------------
  // FIND BY SUPPLIER
  // ---------------------------
  it('should return outstandings by supplier', async () => {
    mockService.findBySupplier.mockResolvedValue([mockOutstanding]);
    const result = await controller.findBySupplier(2);
    expect(result).toEqual([mockOutstanding]);
  });
});
