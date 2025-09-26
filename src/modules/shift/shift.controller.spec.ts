import { Test, TestingModule } from '@nestjs/testing';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

describe('ShiftController', () => {
  let controller: ShiftController;
  let service: ShiftService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    endShiftForCashier: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShiftController],
      providers: [
        {
          provide: ShiftService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ShiftController>(ShiftController);
    service = module.get<ShiftService>(ShiftService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateShiftDto = {
        user_id: 1,
        shop_id: 1,
        counter_id: 1,
        shift_start: new Date(),
      };
      const resultData = { shift_id: 1, ...dto };
      mockService.create.mockResolvedValue(resultData);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(resultData);
    });
  });

  describe('findAll', () => {
    it('should return all shifts', async () => {
      const data = [{ shift_id: 1 }, { shift_id: 2 }];
      mockService.findAll.mockResolvedValue(data);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(data);
    });
  });

  describe('findOne', () => {
    it('should return a single shift', async () => {
      const data = { shift_id: 1 };
      mockService.findOne.mockResolvedValue(data);

      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(data);
    });
  });

  describe('update', () => {
    it('should call service.update', async () => {
      const dto: UpdateShiftDto = { closing_cash: 100 };
      mockService.update.mockResolvedValue({ shift_id: 1, ...dto });

      const result = await controller.update(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ shift_id: 1, ...dto });
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('endShift', () => {
    it('should call service.endShiftForCashier', async () => {
      const mockShift = { shift_id: 1, status: 'CLOSED' };
      mockService.endShiftForCashier.mockResolvedValue(mockShift);

      const result = await controller.endShift(1);
      expect(service.endShiftForCashier).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockShift);
    });
  });
});
