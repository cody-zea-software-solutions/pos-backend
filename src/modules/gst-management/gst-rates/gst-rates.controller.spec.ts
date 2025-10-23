import { Test, TestingModule } from '@nestjs/testing';
import { GstRatesController } from './gst-rates.controller';
import { GstRatesService } from './gst-rates.service';
import { GstCategory } from './gst-rates.entity';

const mockGstRate = {
  gst_rate_id: 1,
  hsn_code: '1234',
  gst_category: GstCategory.GOODS,
  cgst_rate: 5,
  sgst_rate: 5,
  igst_rate: 10,
  cess_rate: 0,
  description: 'Test',
  effective_from: new Date(),
  effective_to: null,
  is_active: true,
  created_at: new Date(),
};

describe('GstRatesController', () => {
  let controller: GstRatesController;
  let service: GstRatesService;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockGstRate),
    findAll: jest.fn().mockResolvedValue([mockGstRate]),
    findOne: jest.fn().mockResolvedValue(mockGstRate),
    update: jest.fn().mockResolvedValue(mockGstRate),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GstRatesController],
      providers: [{ provide: GstRatesService, useValue: mockService }],
    }).compile();

    controller = module.get<GstRatesController>(GstRatesController);
    service = module.get<GstRatesService>(GstRatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a GST rate', async () => {
    const result = await controller.create(mockGstRate as any);
    expect(result).toEqual(mockGstRate);
    expect(service.create).toHaveBeenCalled();
  });

  it('should return all GST rates', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockGstRate]);
  });

  it('should return one GST rate by id', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockGstRate);
  });

  it('should update a GST rate', async () => {
    const result = await controller.update(1, { cgst_rate: 12 } as any);
    expect(result).toEqual(mockGstRate);
  });

  it('should remove a GST rate', async () => {
    await expect(controller.remove(1)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
