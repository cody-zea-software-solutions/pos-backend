import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrderItemsController } from './purchase-order-items.controller';
import { PurchaseOrderItemsService } from './purchase-order-items.service';

describe('PurchaseOrderItemsController', () => {
  let controller: PurchaseOrderItemsController;
  let service: PurchaseOrderItemsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPurchaseOrder: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    findByPoNumber: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseOrderItemsController],
      providers: [{ provide: PurchaseOrderItemsService, useValue: mockService }],
    }).compile();

    controller = module.get<PurchaseOrderItemsController>(PurchaseOrderItemsController);
    service = module.get<PurchaseOrderItemsService>(PurchaseOrderItemsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with DTO', async () => {
      const dto = { po_id: 1 };
      mockService.create.mockResolvedValue({ po_item_id: 1 });
      const result = await controller.create(dto as any);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ po_item_id: 1 });
    });
  });

  describe('findAll', () => {
    it('should call service.findAll if no po_id', async () => {
      mockService.findAll.mockResolvedValue(['test']);
      const result = await controller.findAll();
      expect(result).toEqual(['test']);
    });

    it('should call service.findByPurchaseOrder if po_id given', async () => {
      mockService.findByPurchaseOrder.mockResolvedValue(['po-item']);
      const result = await controller.findAll(1);
      expect(service.findByPurchaseOrder).toHaveBeenCalledWith(1);
      expect(result).toEqual(['po-item']);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne', async () => {
      mockService.findOne.mockResolvedValue({ po_item_id: 1 });
      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({ po_item_id: 1 });
    });
  });

  describe('update', () => {
    it('should call service.update', async () => {
      const dto = { quantity_ordered: 5 };
      mockService.update.mockResolvedValue({ po_item_id: 1 });
      const result = await controller.update(1, dto as any);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ po_item_id: 1 });
    });
  });

  describe('findByPoNumber', () => {
    it('should call service.findByPoNumber', async () => {
      mockService.findByPoNumber.mockResolvedValue([{ po_item_id: 1 }]);
      const result = await controller.findByPoNumber('PO001');
      expect(service.findByPoNumber).toHaveBeenCalledWith('PO001');
      expect(result).toEqual([{ po_item_id: 1 }]);
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      mockService.remove.mockResolvedValue(undefined);
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
