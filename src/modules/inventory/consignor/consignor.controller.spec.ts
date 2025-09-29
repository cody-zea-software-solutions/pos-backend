import { Test, TestingModule } from '@nestjs/testing';
import { ConsignorController } from './consignor.controller';
import { ConsignorService } from './consignor.service';
import { CreateConsignorDto } from './dto/create-consignor.dto';
import { UpdateConsignorDto } from './dto/update-consignor.dto';

describe('ConsignorController', () => {
  let controller: ConsignorController;
  let service: ConsignorService;

  const mockConsignorService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsignorController],
      providers: [
        {
          provide: ConsignorService,
          useValue: mockConsignorService,
        },
      ],
    }).compile();

    controller = module.get<ConsignorController>(ConsignorController);
    service = module.get<ConsignorService>(ConsignorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct data', async () => {
      const dto: CreateConsignorDto = {
        consignor_name: 'ABC Traders',
        consignor_code: 'C001',
      } as CreateConsignorDto;

      mockConsignorService.create.mockResolvedValue(dto);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of consignors', async () => {
      const consignors = [{ consignor_id: 1, consignor_name: 'Test' }];
      mockConsignorService.findAll.mockResolvedValue(consignors);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(consignors);
    });
  });

  describe('findOne', () => {
    it('should return a consignor by id', async () => {
      const consignor = { consignor_id: 1, consignor_name: 'Test' };
      mockConsignorService.findOne.mockResolvedValue(consignor);

      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(consignor);
    });
  });

  describe('update', () => {
    it('should update consignor by id', async () => {
      const dto: UpdateConsignorDto = { consignor_name: 'Updated' };
      const updatedConsignor = { consignor_id: 1, consignor_name: 'Updated' };

      mockConsignorService.update.mockResolvedValue(updatedConsignor);

      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updatedConsignor);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      mockConsignorService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
