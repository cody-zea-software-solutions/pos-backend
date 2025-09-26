import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyLevelsController } from './loyalty-levels.controller';
import { LoyaltyLevelsService } from './loyalty-levels.service';
import { CreateLoyaltyLevelsDto } from './dto/create-loyalty-levels.dto';
import { UpdateLoyaltyLevelsDto } from './dto/update-loyalty-levels.dto';

describe('LoyaltyLevelsController', () => {
  let controller: LoyaltyLevelsController;
  let service: LoyaltyLevelsService;

  const mockLoyaltyLevelsService = {
    create: jest.fn(dto => ({ id: Date.now(), ...dto })),
    findAll: jest.fn(() => [{ level_id: 1, level_name: 'Silver' }]),
    findOne: jest.fn(id => ({ level_id: id, level_name: 'Gold' })),
    update: jest.fn((id, dto) => ({ level_id: id, ...dto })),
    remove: jest.fn(id => ({ deleted: true, id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyLevelsController],
      providers: [
        { provide: LoyaltyLevelsService, useValue: mockLoyaltyLevelsService },
      ],
    }).compile();

    controller = module.get<LoyaltyLevelsController>(LoyaltyLevelsController);
    service = module.get<LoyaltyLevelsService>(LoyaltyLevelsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a loyalty level', () => {
    const dto: CreateLoyaltyLevelsDto = { level_name: 'Bronze' } as any;
    expect(controller.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all loyalty levels', () => {
    expect(controller.findAll()).toEqual([{ level_id: 1, level_name: 'Silver' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one loyalty level', () => {
    expect(controller.findOne(1)).toEqual({ level_id: 1, level_name: 'Gold' });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a loyalty level', () => {
    const dto: UpdateLoyaltyLevelsDto = { level_name: 'Platinum' } as any;
    expect(controller.update(1, dto)).toEqual({ level_id: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a loyalty level', () => {
    expect(controller.remove(1)).toEqual({ deleted: true, id: 1 });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
