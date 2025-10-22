import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrder, PurchaseOrderStatus } from './purchase-order.entity';

describe('PurchaseOrdersController', () => {
  let controller: PurchaseOrdersController;
  let service: PurchaseOrdersService;

  const mockPurchaseOrder = {
    po_id: 1,
    po_number: 'PO-001',
    status: PurchaseOrderStatus.DRAFT,
  } as PurchaseOrder;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByPoNumber: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseOrdersController],
      providers: [{ provide: PurchaseOrdersService, useValue: mockService }],
    }).compile();

    controller = module.get<PurchaseOrdersController>(PurchaseOrdersController);
    service = module.get<PurchaseOrdersService>(PurchaseOrdersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a purchase order', async () => {
      mockService.create.mockResolvedValue(mockPurchaseOrder);
      const dto = { po_number: 'PO-001', shop_id: 1, supplier_id: 1 };
      const result = await controller.create(dto as any);
      expect(result).toEqual(mockPurchaseOrder);
    });
  });

  describe('findAll', () => {
    it('should return all purchase orders', async () => {
      mockService.findAll.mockResolvedValue([mockPurchaseOrder]);
      const result = await controller.findAll();
      expect(result).toEqual([mockPurchaseOrder]);
    });
  });

  describe('findOne', () => {
    it('should return a purchase order by ID', async () => {
      mockService.findOne.mockResolvedValue(mockPurchaseOrder);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockPurchaseOrder);
    });
  });

  describe('update', () => {
    it('should update a purchase order', async () => {
      mockService.update.mockResolvedValue({ ...mockPurchaseOrder, status: PurchaseOrderStatus.APPROVED });
      const result = await controller.update(1, { status: PurchaseOrderStatus.APPROVED });
      expect(result.status).toBe(PurchaseOrderStatus.APPROVED);
    });
  });

  describe('remove', () => {
    it('should remove a purchase order', async () => {
      mockService.remove.mockResolvedValue(undefined);
      const result = await controller.remove(1);
      expect(result).toBeUndefined();
    });
  });

  describe('findByPoNumber', () => {
    it('should return PO by number', async () => {
      mockService.findByPoNumber.mockResolvedValue(mockPurchaseOrder);
      const result = await controller.findByPoNumber('PO-001');
      expect(result).toEqual(mockPurchaseOrder);
    });
  });
});
