import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [{ provide: ServicesService, useValue: mockService }],
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

  it('should create a service', async () => {
    const dto: CreateServiceDto = {
      service_name: 'Test Service',
      service_code: 'TS001',
      base_price: 100,
      cost_price: 50,
      service_type: 'INDIVIDUAL',
    } as any;

    const result = { ...dto, service_id: 1 };
    mockService.create.mockResolvedValue(result);

    expect(await controller.create(dto)).toEqual(result);
  });

  it('should create a service with file', async () => {
    const dto: CreateServiceDto = {
      service_name: 'With File',
      service_code: 'WF001',
      base_price: 200,
      cost_price: 100,
      service_type: 'INDIVIDUAL',
    } as any;

    const file = { filename: 'test.png' } as Express.Multer.File;
    const result = { ...dto, service_id: 2, image_url: '/uploads/services/test.png' };

    mockService.create.mockResolvedValue(result);

    expect(await controller.create(dto, file)).toEqual(result);
  });

  it('should find all services', async () => {
    const result = [{ service_id: 1 }];
    mockService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toEqual(result);
  });

  it('should find one service', async () => {
    const result = { service_id: 1 };
    mockService.findOne.mockResolvedValue(result);

    expect(await controller.findOne('1')).toEqual(result);
  });

  it('should update a service', async () => {
    const dto: UpdateServiceDto = { service_name: 'Updated' };
    const result = { service_id: 1, ...dto };
    mockService.update.mockResolvedValue(result);

    expect(await controller.update('1', dto)).toEqual(result);
  });

  it('should update a service with file', async () => {
    const dto: UpdateServiceDto = { service_name: 'Updated File' };
    const file = { filename: 'update.png' } as Express.Multer.File;
    const result = { service_id: 1, ...dto, image_url: '/uploads/services/update.png' };

    mockService.update.mockResolvedValue(result);

    expect(await controller.update('1', dto, file)).toEqual(result);
  });

  it('should remove a service', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    expect(await controller.remove('1')).toEqual({ deleted: true });
  });
});
 