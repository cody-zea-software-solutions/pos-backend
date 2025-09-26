import { Test, TestingModule } from '@nestjs/testing';
import { BusinessService } from './business.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './business.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('BusinessService', () => {
  let service: BusinessService;
  let repo: jest.Mocked<Repository<Business>>;

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessService,
        { provide: getRepositoryToken(Business), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<BusinessService>(BusinessService);
    repo = module.get(getRepositoryToken(Business));
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a business', async () => {
    const dto = { business_name: 'ABC', business_type: 'Retail' };
    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.create.mockReturnValue(dto as any);
    mockRepo.save.mockResolvedValue({ business_id: 1, ...dto });

    const result = await service.create(dto as any);
    expect(result.business_id).toBe(1);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw ConflictException if business name exists', async () => {
    mockRepo.findOne.mockResolvedValue({ business_id: 1 });
    await expect(service.create({ business_name: 'ABC' } as any)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should return all businesses', async () => {
    const data = [{ business_id: 1 }];
    mockRepo.find.mockResolvedValue(data);

    const result = await service.findAll();
    expect(result).toEqual(data);
    expect(repo.find).toHaveBeenCalledWith({ relations: ['shops'] });
  });

  it('should find one business', async () => {
    mockRepo.findOne.mockResolvedValue({ business_id: 1 });
    const result = await service.findOne(1);

    expect(result).toEqual({ business_id: 1 });
  });

  it('should throw NotFoundException when business not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('should update a business', async () => {
    const existing = { business_id: 1, business_name: 'ABC' };
    mockRepo.findOne.mockResolvedValue(existing);
    mockRepo.save.mockResolvedValue({ ...existing, business_type: 'Wholesale' });

    const result = await service.update(1, { business_type: 'Wholesale' } as any);
    expect(result.business_type).toBe('Wholesale');
  });

  it('should remove a business', async () => {
    const business = { business_id: 1 };
    mockRepo.findOne.mockResolvedValue(business);
    mockRepo.remove.mockResolvedValue(business);

    const result = await service.remove(1);
    expect(result).toEqual(business);
    expect(repo.remove).toHaveBeenCalledWith(business);
  });
});
