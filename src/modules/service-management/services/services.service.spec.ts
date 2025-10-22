import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service, ServiceType } from './service.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ServicesService', () => {
  let service: ServicesService;
  let repo: Repository<Service>;

  const mockService: Partial<Service> = {
    service_id: 1,
    service_name: 'Test Service',
    service_code: 'TS001',
    base_price: 100,
    cost_price: 50,
    service_type: ServiceType.INDIVIDUAL,
  };

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: getRepositoryToken(Service), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    repo = module.get<Repository<Service>>(getRepositoryToken(Service));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a service', async () => {
    const dto = { service_name: 'New', service_code: 'NEW001' } as any;
    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.create.mockReturnValue(dto);
    mockRepo.save.mockResolvedValue({ ...dto, service_id: 2 });

    expect(await service.create(dto)).toEqual({ ...dto, service_id: 2 });
  });

  it('should create a service with file', async () => {
    const dto = { service_name: 'File Service', service_code: 'FS001' } as any;
    const file = { filename: 'file.png' } as Express.Multer.File;

    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.create.mockReturnValue(dto);
    mockRepo.save.mockResolvedValue({
      ...dto,
      service_id: 3,
      image_url: '/uploads/services/file.png',
    });

    expect(await service.create(dto, file)).toEqual({
      ...dto,
      service_id: 3,
      image_url: '/uploads/services/file.png',
    });
  });

  it('should throw conflict if service_code exists on create', async () => {
    mockRepo.findOne.mockResolvedValue(mockService);
    await expect(
      service.create({ service_code: 'TS001' } as any),
    ).rejects.toThrow(ConflictException);
  });

  it('should find all services', async () => {
    mockRepo.find.mockResolvedValue([mockService]);
    expect(await service.findAll()).toEqual([mockService]);
  });

  it('should find one service', async () => {
    mockRepo.findOne.mockResolvedValue(mockService);
    expect(await service.findOne(1)).toEqual(mockService);
  });

  it('should throw not found if service does not exist', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
  });

  it('should update a service', async () => {
    const dto = { service_name: 'Updated' } as any;
    mockRepo.findOne.mockResolvedValue(mockService);
    mockRepo.save.mockResolvedValue({ ...mockService, ...dto });

    expect(await service.update(1, dto)).toEqual({ ...mockService, ...dto });
  });

  it('should update a service with file', async () => {
    const dto = { service_name: 'Updated file' } as any;
    const file = { filename: 'update.png' } as Express.Multer.File;

    mockRepo.findOne.mockResolvedValue(mockService);
    mockRepo.save.mockResolvedValue({
      ...mockService,
      ...dto,
      image_url: '/uploads/services/update.png',
    });

    expect(await service.update(1, dto, file)).toEqual({
      ...mockService,
      ...dto,
      image_url: '/uploads/services/update.png',
    });
  });

  it('should throw ConflictException when updating with duplicate service_code', async () => {
    const dto = { service_code: 'DUP' } as any;
    mockRepo.findOne.mockResolvedValueOnce(mockService);
    mockRepo.findOne.mockResolvedValueOnce({ ...mockService, service_id: 2 });

    await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
  });

  it('should throw NotFoundException on update if service not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
  });

  it('should remove a service', async () => {
    mockRepo.findOne.mockResolvedValue(mockService);
    mockRepo.remove.mockResolvedValue(mockService);

    await expect(service.remove(1)).resolves.toBeUndefined(); // ✅ Fixed line
  });

  it('should throw NotFoundException on remove if service not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.remove(2)).rejects.toThrow(NotFoundException);
  });

  it('should find services by name', async () => {
    mockRepo.find.mockResolvedValue([mockService]);
    expect(await service.findByName('Test')).toEqual([mockService]);
  });
});
