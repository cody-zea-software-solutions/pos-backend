import { Test, TestingModule } from '@nestjs/testing';
import { GrnItemsController } from './grn-items.controller';
import { GrnItemsService } from './grn-items.service';

describe('GrnItemsController', () => {
  let controller: GrnItemsController;
  let service: GrnItemsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByGrn: jest.fn(),
    findByGrnNumber: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrnItemsController],
      providers: [{ provide: GrnItemsService, useValue: mockService }],
    }).compile();

    controller = module.get<GrnItemsController>(GrnItemsController);
    service = module.get<GrnItemsService>(GrnItemsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should call service.create() on create()', async () => {
    const dto = { grn_id: 1, quantity_ordered: 10 };
    mockService.create.mockResolvedValue(dto);
    const result = await controller.create(dto as any);
    expect(result).toEqual(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll() when no grn_id is provided', async () => {
    mockService.findAll.mockResolvedValue(['item1']);
    const result = await controller.findAll();
    expect(result).toEqual(['item1']);
  });

  it('should call findByGrn() when grn_id is provided', async () => {
    mockService.findByGrn.mockResolvedValue(['filtered']);
    const result = await controller.findAll(1);
    expect(result).toEqual(['filtered']);
  });

  it('should call findOne() correctly', async () => {
    const item = { grn_item_id: 1 };
    mockService.findOne.mockResolvedValue(item);
    const result = await controller.findOne(1);
    expect(result).toEqual(item);
  });

  it('should call update() correctly', async () => {
    const dto = { quantity_ordered: 5 };
    const updated = { ...dto, grn_item_id: 1 };
    mockService.update.mockResolvedValue(updated);
    const result = await controller.update(1, dto as any);
    expect(result).toEqual(updated);
  });

  it('should call findByGrnNumber() correctly', async () => {
    const items = [{ grn_item_id: 1 }];
    mockService.findByGrnNumber.mockResolvedValue(items);
    const result = await controller.findByGrnNumber('GRN-001');
    expect(result).toEqual(items);
  });

  it('should call remove() correctly', async () => {
    mockService.remove.mockResolvedValue(undefined);
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
