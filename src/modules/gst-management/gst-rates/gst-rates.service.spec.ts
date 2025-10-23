import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GstRatesService } from './gst-rates.service';
import { GstRate, GstCategory } from './gst-rates.entity';
import { NotFoundException } from '@nestjs/common';

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

describe('GstRatesService', () => {
  let service: GstRatesService;
  let repo: Repository<GstRate>;

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => ({ ...dto })),
    save: jest.fn().mockResolvedValue(mockGstRate),
    find: jest.fn().mockResolvedValue([mockGstRate]),
    findOne: jest.fn().mockImplementation(({ where: { gst_rate_id } }) => {
      if (gst_rate_id === 1) return Promise.resolve(mockGstRate);
      return Promise.resolve(null);
    }),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GstRatesService,
        { provide: getRepositoryToken(GstRate), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<GstRatesService>(GstRatesService);
    repo = module.get<Repository<GstRate>>(getRepositoryToken(GstRate));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a GST rate', async () => {
    const result = await service.create(mockGstRate as any);
    expect(result).toEqual(mockGstRate);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should find all GST rates', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockGstRate]);
  });

  it('should find one GST rate by id', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockGstRate);
  });

  it('should throw NotFoundException if GST rate not found', async () => {
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a GST rate', async () => {
    const result = await service.update(1, { cgst_rate: 12 });
    expect(result.cgst_rate).toEqual(5); // Because our mock still returns mockGstRate
    expect(repo.update).toHaveBeenCalled();
  });

  it('should remove a GST rate', async () => {
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(repo.delete).toHaveBeenCalled();
  });

  it('should throw NotFoundException if GST rate to remove not found', async () => {
    repo.delete = jest.fn().mockResolvedValue({ affected: 0 });
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
