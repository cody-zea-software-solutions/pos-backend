import { Test, TestingModule } from '@nestjs/testing';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

describe('BusinessController', () => {
  let controller: BusinessController;
  let service: BusinessService;

  const mockBusinessService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessController],
      providers: [{ provide: BusinessService, useValue: mockBusinessService }],
    }).compile();

    controller = module.get<BusinessController>(BusinessController);
    service = module.get<BusinessService>(BusinessService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a business', async () => {
    const dto: CreateBusinessDto = { business_name: 'ABC', business_type: 'Retail' } as any;
    mockBusinessService.create.mockResolvedValue({ business_id: 1, ...dto });

    const result = await controller.create(dto);
    expect(result).toEqual({ business_id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should get all businesses', async () => {
    mockBusinessService.findAll.mockResolvedValue([{ business_id: 1 }]);
    const result = await controller.findAll();

    expect(result).toEqual([{ business_id: 1 }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get one business', async () => {
    mockBusinessService.findOne.mockResolvedValue({ business_id: 1 });
    const result = await controller.findOne(1);

    expect(result).toEqual({ business_id: 1 });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update business', async () => {
    const dto: UpdateBusinessDto = { business_type: 'Wholesale' } as any;
    mockBusinessService.update.mockResolvedValue({ business_id: 1, ...dto });

    const result = await controller.update(1, dto);
    expect(result).toEqual({ business_id: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove business', async () => {
    mockBusinessService.remove.mockResolvedValue({ affected: 1 });

    const result = await controller.remove(1);
    expect(result).toEqual({ affected: 1 });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
