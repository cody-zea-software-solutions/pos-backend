import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service, ServiceType } from './service.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  const mockService: Partial<Service> = {
    service_id: 1,
    service_name: 'Test Service',
    service_code: 'TS001',
    base_price: 100,
    cost_price: 50,
    service_type: ServiceType.INDIVIDUAL,
    image_url: undefined,
  };

  const mockServicesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        { provide: ServicesService, useValue: mockServicesService },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a service without file', async () => {
      const dto = { service_name: 'New', service_code: 'NEW001', base_price: 100, cost_price: 50, service_type: ServiceType.INDIVIDUAL } as any;
      mockServicesService.create.mockResolvedValue({ ...dto, service_id: 2 });

      expect(await controller.create(dto)).toEqual({ ...dto, service_id: 2 });
      expect(mockServicesService.create).toHaveBeenCalledWith(dto, undefined);
    });

    it('should create a service with file', async () => {
      const dto = { service_name: 'File Service', service_code: 'FS001', base_price: 100, cost_price: 50, service_type: ServiceType.INDIVIDUAL } as any;
      const file = { filename: 'file.png' } as Express.Multer.File;

      mockServicesService.create.mockResolvedValue({ ...dto, service_id: 3, image_url: '/uploads/services/file.png' });

      expect(await controller.create(dto, file)).toEqual({ ...dto, service_id: 3, image_url: '/uploads/services/file.png' });
      expect(mockServicesService.create).toHaveBeenCalledWith(dto, file);
    });
  });

  describe('findAll', () => {
    it('should return all services', async () => {
      mockServicesService.findAll.mockResolvedValue([mockService]);
      expect(await controller.findAll()).toEqual([mockService]);
      expect(mockServicesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a service by id', async () => {
      mockServicesService.findOne.mockResolvedValue(mockService);
      expect(await controller.findOne('1')).toEqual(mockService);
      expect(mockServicesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a service without file', async () => {
      const dto = { service_name: 'Updated' } as any;
      mockServicesService.update.mockResolvedValue({ ...mockService, ...dto });

      expect(await controller.update('1', dto)).toEqual({ ...mockService, ...dto });
      expect(mockServicesService.update).toHaveBeenCalledWith(1, dto, undefined);
    });

    it('should update a service with file', async () => {
      const dto = { service_name: 'Updated file' } as any;
      const file = { filename: 'update.png' } as Express.Multer.File;
      mockServicesService.update.mockResolvedValue({ ...mockService, ...dto, image_url: '/uploads/services/update.png' });

      expect(await controller.update('1', dto, file)).toEqual({ ...mockService, ...dto, image_url: '/uploads/services/update.png' });
      expect(mockServicesService.update).toHaveBeenCalledWith(1, dto, file);
    });
  });

  describe('remove', () => {
    it('should remove a service', async () => {
      mockServicesService.remove.mockResolvedValue(undefined);

      await controller.remove('1');
      expect(mockServicesService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findByName', () => {
    it('should find services by name', async () => {
      mockServicesService.findByName.mockResolvedValue([mockService]);

      expect(await controller.findByName('Test')).toEqual([mockService]);
      expect(mockServicesService.findByName).toHaveBeenCalledWith('Test');
    });
  });
});
