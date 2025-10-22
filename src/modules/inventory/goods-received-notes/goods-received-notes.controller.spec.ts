import { Test, TestingModule } from '@nestjs/testing';
import { GoodsReceivedNotesController } from './goods-received-notes.controller';
import { GoodsReceivedNotesService } from './goods-received-notes.service';

describe('GoodsReceivedNotesController', () => {
  let controller: GoodsReceivedNotesController;
  let service: GoodsReceivedNotesService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByGrnNumber: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsReceivedNotesController],
      providers: [
        { provide: GoodsReceivedNotesService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<GoodsReceivedNotesController>(GoodsReceivedNotesController);
    service = module.get<GoodsReceivedNotesService>(GoodsReceivedNotesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with DTO', async () => {
      const dto = { grn_number: 'GRN001' };
      mockService.create.mockResolvedValue(dto);
      const result = await controller.create(dto as any);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(dto);
    });
  });

  describe('findAll', () => {
    it('should return all GRNs', async () => {
      mockService.findAll.mockResolvedValue(['test']);
      const result = await controller.findAll();
      expect(result).toEqual(['test']);
    });
  });

  describe('findOne', () => {
    it('should return one GRN', async () => {
      mockService.findOne.mockResolvedValue({ grn_id: 1 });
      const result = await controller.findOne(1);
      expect(result).toEqual({ grn_id: 1 });
    });
  });

  describe('findByGrnNumber', () => {
    it('should return GRN by number', async () => {
      mockService.findByGrnNumber.mockResolvedValue({ grn_number: 'GRN001' });
      const result = await controller.findByGrnNumber('GRN001');
      expect(result).toEqual({ grn_number: 'GRN001' });
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto = { status: 'POSTED' };
      mockService.update.mockResolvedValue({ grn_id: 1 });
      const result = await controller.update(1, dto as any);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ grn_id: 1 });
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      mockService.remove.mockResolvedValue(undefined);
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
