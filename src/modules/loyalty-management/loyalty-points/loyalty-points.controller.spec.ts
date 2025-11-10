import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyPointsController } from './loyalty-points.controller';
import { LoyaltyPointsService } from './loyalty-points.service';
import { NotFoundException } from '@nestjs/common';

describe('LoyaltyPointsController', () => {
  let controller: LoyaltyPointsController;
  let service: LoyaltyPointsService;

  const mockLoyaltyPointsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyPointsController],
      providers: [
        {
          provide: LoyaltyPointsService,
          useValue: mockLoyaltyPointsService,
        },
      ],
    }).compile();

    controller = module.get<LoyaltyPointsController>(LoyaltyPointsController);
    service = module.get<LoyaltyPointsService>(LoyaltyPointsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all loyalty points records', async () => {
      const mockData = [{ point_id: 1 }, { point_id: 2 }];
      mockLoyaltyPointsService.findAll.mockResolvedValue(mockData);

      const result = await controller.findAll();
      expect(result).toEqual(mockData);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a loyalty point record by ID', async () => {
      const mockRecord = { point_id: 1 };
      mockLoyaltyPointsService.findOne.mockResolvedValue(mockRecord);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockRecord);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if record not found', async () => {
      mockLoyaltyPointsService.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should call service.remove with given id', async () => {
      mockLoyaltyPointsService.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
