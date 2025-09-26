import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyPointsController } from './loyalty-points.controller';
import { LoyaltyPointsService } from './loyalty-points.service';
import { CreateLoyaltyPointsDto } from './dto/create-loyalty-points.dto';
import { UpdateLoyaltyPointsDto } from './dto/update-loyalty-points.dto';

describe('LoyaltyPointsController', () => {
  let controller: LoyaltyPointsController;
  let service: LoyaltyPointsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyPointsController],
      providers: [
        {
          provide: LoyaltyPointsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LoyaltyPointsController>(LoyaltyPointsController);
    service = module.get<LoyaltyPointsService>(LoyaltyPointsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct dto', async () => {
      const dto: CreateLoyaltyPointsDto = {
        customer_id: 1,
        shop_id: 2,
        counter_id: 3,
        created_by_user: 4,
        points_earned: 50,
        transaction_type: 'PURCHASE',
        transaction_ref: 'TXN123',
      };

      mockService.create.mockResolvedValue({ ...dto, point_id: 1 });

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ ...dto, point_id: 1 });
    });
  });

  describe('findAll', () => {
    it('should return all records', async () => {
      const data = [{ point_id: 1 }, { point_id: 2 }];
      mockService.findAll.mockResolvedValue(data);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(data);
    });
  });

  describe('findOne', () => {
    it('should return a single record', async () => {
      const data = { point_id: 1 };
      mockService.findOne.mockResolvedValue(data);

      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(data);
    });
  });

  describe('update', () => {
    it('should call service.update with correct params', async () => {
      const dto: UpdateLoyaltyPointsDto = { points_earned: 100 };
      mockService.update.mockResolvedValue({ point_id: 1, ...dto });

      const result = await controller.update(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ point_id: 1, ...dto });
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
