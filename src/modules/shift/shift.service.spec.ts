import { Test, TestingModule } from '@nestjs/testing';
import { ShiftService } from './shift.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Shift } from './shift.entity';
import { Counter } from '../counter/counter.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ShopService } from '../shop/shop.service';
import { CounterService } from '../counter/counter.service';
import { NotFoundException } from '@nestjs/common';

type MockRepo<T extends object = any> = jest.Mocked<Repository<T>>;

const createMockRepo = <T extends object = any>(): MockRepo<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
} as unknown as MockRepo<T>);

describe('ShiftService', () => {
  let service: ShiftService;
  let shiftRepo: MockRepo<Shift>;
  let counterRepo: MockRepo<Counter>;
  let userService: UsersService;
  let shopService: ShopService;
  let counterService: CounterService;

  beforeEach(async () => {
    shiftRepo = createMockRepo<Shift>();
    counterRepo = createMockRepo<Counter>();

    const mockUserService = { findOne: jest.fn() };
    const mockShopService = { findOne: jest.fn() };
    const mockCounterService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftService,
        { provide: getRepositoryToken(Shift), useValue: shiftRepo },
        { provide: getRepositoryToken(Counter), useValue: counterRepo },
        { provide: UsersService, useValue: mockUserService },
        { provide: ShopService, useValue: mockShopService },
        { provide: CounterService, useValue: mockCounterService },
      ],
    }).compile();

    service = module.get<ShiftService>(ShiftService);
    userService = module.get<UsersService>(UsersService);
    shopService = module.get<ShopService>(ShopService);
    counterService = module.get<CounterService>(CounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw if user not found', async () => {
      (userService.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.create({ user_id: 1, shop_id: 1, counter_id: 1, shift_start: new Date() } as any))
        .rejects.toThrow(NotFoundException);
    });

    it('should create and save shift', async () => {
      (userService.findOne as jest.Mock).mockResolvedValue({ user_id: 1 });
      (shopService.findOne as jest.Mock).mockResolvedValue({ shop_id: 1 });
      (counterService.findOne as jest.Mock).mockResolvedValue({ counter_id: 1 });

      const mockShift = { shift_id: 1 };
      shiftRepo.create.mockReturnValue(mockShift as any);
      shiftRepo.save.mockResolvedValue(mockShift as any);

      const result = await service.create({
        user_id: 1,
        shop_id: 1,
        counter_id: 1,
        shift_start: new Date(),
      });

      expect(result).toEqual(mockShift);
      expect(shiftRepo.save).toHaveBeenCalledWith(mockShift);
    });
  });

  describe('findAll', () => {
    it('should return all shifts', async () => {
      const data = [{ shift_id: 1 }];
      shiftRepo.find.mockResolvedValue(data as any);

      const result = await service.findAll();
      expect(result).toEqual(data);
    });
  });

  describe('findOne', () => {
    it('should throw if not found', async () => {
      shiftRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return shift if found', async () => {
      const shift = { shift_id: 1 };
      shiftRepo.findOne.mockResolvedValue(shift as any);
      const result = await service.findOne(1);
      expect(result).toEqual(shift);
    });
  });

  describe('update', () => {
    it('should update and save shift', async () => {
      const existingShift = { shift_id: 1, opening_cash: 10, closing_cash: 20 };
      jest.spyOn(service, 'findOne').mockResolvedValue(existingShift as any);
      (userService.findOne as jest.Mock).mockResolvedValue({ user_id: 1 });

      shiftRepo.save.mockResolvedValue({ ...existingShift, closing_cash: 30 } as any);

      const result = await service.update(1, { closing_cash: 30 });
      expect(result.closing_cash).toBe(30);
    });
  });

  describe('remove', () => {
    it('should remove shift', async () => {
      const shift = { shift_id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(shift as any);
      shiftRepo.remove.mockResolvedValue(shift as any);

      await service.remove(1);
      expect(shiftRepo.remove).toHaveBeenCalledWith(shift);
    });
  });

  describe('startShiftForCashier', () => {
    it('should return active shift if exists', async () => {
      (userService.findOne as jest.Mock).mockResolvedValue({ user_id: 1 });
      shiftRepo.findOne.mockResolvedValue({ shift_id: 99 } as any);

      const result = await service.startShiftForCashier(1, {} as any);
      expect(result).toEqual({ shift_id: 99 });
    });

    it('should create a new shift if no active shift', async () => {
      (userService.findOne as jest.Mock).mockResolvedValue({ user_id: 1 });
      shiftRepo.findOne.mockResolvedValue(null);
      const mockShift = { shift_id: 100 };
      shiftRepo.create.mockReturnValue(mockShift as any);
      shiftRepo.save.mockResolvedValue(mockShift as any);

      const result = await service.startShiftForCashier(1, {} as any);
      expect(result).toEqual(mockShift);
    });
  });

  describe('endShiftForCashier', () => {
    it('should return null if no active shift', async () => {
      (userService.findOne as jest.Mock).mockResolvedValue({ user_id: 1 });
      shiftRepo.findOne.mockResolvedValue(null);

      const result = await service.endShiftForCashier(1);
      expect(result).toBeNull();
    });

    it('should close active shift and save', async () => {
      const activeShift = { shift_id: 1, counter: { counter_id: 1 } };
      (userService.findOne as jest.Mock).mockResolvedValue({ user_id: 1 });
      shiftRepo.findOne.mockResolvedValue(activeShift as any);
      shiftRepo.save.mockResolvedValue({ ...activeShift, status: 'CLOSED' } as any);

      const result = await service.endShiftForCashier(1);
      expect(result).not.toBeNull();
      expect(result!.status).toBe('CLOSED');
    });
  });
});
