import { Test, TestingModule } from '@nestjs/testing';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

describe('PromotionController', () => {
  let controller: PromotionController;
  let service: PromotionService;

  const mockPromotion = {
    promotion_id: 1,
    title: 'New Year Sale',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockPromotion),
    findAll: jest.fn().mockResolvedValue([mockPromotion]),
    findOne: jest.fn().mockResolvedValue(mockPromotion),
    update: jest.fn().mockResolvedValue(mockPromotion),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionController],
      providers: [{ provide: PromotionService, useValue: mockService }],
    }).compile();

    controller = module.get<PromotionController>(PromotionController);
    service = module.get<PromotionService>(PromotionService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create()', () => {
    it('should call service.create and return result', async () => {
      const dto: CreatePromotionDto = { title: 'New Year Sale' } as any;
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockPromotion);
    });
  });

  describe('findAll()', () => {
    it('should return all promotions', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockPromotion]);
    });
  });

  describe('findOne()', () => {
    it('should return a promotion by ID', async () => {
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPromotion);
    });
  });

  describe('update()', () => {
    it('should update and return a promotion', async () => {
      const dto: UpdatePromotionDto = { title: 'Updated Sale' } as any;
      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(mockPromotion);
    });
  });

  describe('remove()', () => {
    it('should remove a promotion', async () => {
      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
