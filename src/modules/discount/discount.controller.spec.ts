import { Test, TestingModule } from '@nestjs/testing';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

describe('DiscountController', () => {
  let controller: DiscountController;
  let service: DiscountService;

  const mockDiscountService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountController],
      providers: [
        {
          provide: DiscountService,
          useValue: mockDiscountService,
        },
      ],
    }).compile();

    controller = module.get<DiscountController>(DiscountController);
    service = module.get<DiscountService>(DiscountService);
  });

  afterEach(() => jest.clearAllMocks());

  const mockDiscount = {
    discount_id: 1,
    discount_name: 'New Year Sale',
    discount_code: 'NY2025',
    discount_type: 'PERCENTAGE',
    discount_value: 10,
  };

  describe('create', () => {
    it('should create a discount', async () => {
      const dto: CreateDiscountDto = {
        discount_name: 'New Year Sale',
        discount_code: 'NY2025',
        discount_type: 'PERCENTAGE',
        discount_value: 10,
      };
      mockDiscountService.create.mockResolvedValue(mockDiscount);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockDiscount);
    });
  });

  describe('findAll', () => {
    it('should return an array of discounts', async () => {
      mockDiscountService.findAll.mockResolvedValue([mockDiscount]);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockDiscount]);
    });
  });

  describe('findOne', () => {
    it('should return one discount', async () => {
      mockDiscountService.findOne.mockResolvedValue(mockDiscount);
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDiscount);
    });
  });

  describe('update', () => {
    it('should update a discount', async () => {
      const dto: UpdateDiscountDto = { discount_name: 'Updated Sale' };
      mockDiscountService.update.mockResolvedValue({ ...mockDiscount, ...dto });

      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ ...mockDiscount, ...dto });
    });
  });

  describe('remove', () => {
    it('should remove a discount', async () => {
      mockDiscountService.remove.mockResolvedValue(undefined);
      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
