import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoyaltyLevelsService } from './loyalty-levels.service';
import { LoyaltyLevel } from './loyalty-levels.entity';
import { Repository } from 'typeorm';

describe('LoyaltyLevelsService', () => {
  let service: LoyaltyLevelsService;
  let repo: Repository<LoyaltyLevel>;

  const mockLoyaltyRepo = {
    create: jest.fn(dto => dto),
    save: jest.fn(loyalty => Promise.resolve({ level_id: 1, ...loyalty })),
    find: jest.fn(() => Promise.resolve([{ level_id: 1, level_name: 'Silver' }])),
    findOneBy: jest.fn(({ level_id }) =>
      Promise.resolve({ level_id, level_name: 'Gold' }),
    ),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(id => Promise.resolve({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyLevelsService,
        {
          provide: getRepositoryToken(LoyaltyLevel),
          useValue: mockLoyaltyRepo,
        },
      ],
    }).compile();

    service = module.get<LoyaltyLevelsService>(LoyaltyLevelsService);
    repo = module.get<Repository<LoyaltyLevel>>(getRepositoryToken(LoyaltyLevel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a loyalty level', async () => {
    const dto = { level_name: 'Bronze' } as any;
    expect(await service.create(dto)).toEqual({
      level_id: 1,
      ...dto,
    });
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should return all loyalty levels', async () => {
    expect(await service.findAll()).toEqual([{ level_id: 1, level_name: 'Silver' }]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should return one loyalty level', async () => {
    expect(await service.findOne(1)).toEqual({ level_id: 1, level_name: 'Gold' });
    expect(repo.findOneBy).toHaveBeenCalledWith({ level_id: 1 });
  });

  it('should update a loyalty level', async () => {
    const dto = { level_name: 'Platinum' } as any;
    jest.spyOn(service, 'findOne').mockResolvedValue({ level_id: 1, ...dto });

    expect(await service.update(1, dto)).toEqual({ level_id: 1, ...dto });
    expect(repo.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a loyalty level', async () => {
    expect(await service.remove(1)).toEqual({ affected: 1 });
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});
