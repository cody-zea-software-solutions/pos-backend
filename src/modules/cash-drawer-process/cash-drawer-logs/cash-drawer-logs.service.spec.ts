import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashDrawerLogs } from './cash-drawer-logs.entity';
import { CashDrawerLogsService } from './cash-drawer-logs.service';
import { NotFoundException } from '@nestjs/common';

const mockCashDrawerLogs = {
  log_id: 1,
  action: 'Open Drawer',
  amount: 100.00,
  reason: 'Test reason',
  notes: 'Test notes',
  reference_id: 'REF123',
  requires_approval: false,
  performed_by_user: { user_id: 1 },
  approved_by_user: { user_id: 2 },
  counter: { counter_id: 1 },
  shift: { shift_id: 1 },
  action_time: new Date(),
};

describe('CashDrawerLogsService', () => {
  let service: CashDrawerLogsService;
  let repo: Repository<CashDrawerLogs>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashDrawerLogsService,
        {
          provide: getRepositoryToken(CashDrawerLogs),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CashDrawerLogsService>(CashDrawerLogsService);
    repo = module.get<Repository<CashDrawerLogs>>(getRepositoryToken(CashDrawerLogs));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a cash drawer log', async () => {
      jest.spyOn(repo, 'create').mockReturnValue(mockCashDrawerLogs as any);
      jest.spyOn(repo, 'save').mockResolvedValue(mockCashDrawerLogs as any);
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockCashDrawerLogs as any);

      const dto = {
        shift_id: 1,
        counter_id: 1,
        action: 'Open Drawer',
        amount: 100,
        performed_by_user: 1,
        reason: 'Test reason',
        notes: 'Test notes',
        reference_id: 'REF123',
        requires_approval: false,
        approved_by_user: 2,
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockCashDrawerLogs);
    });
  });

  describe('findAll', () => {
    it('should return an array of logs', async () => {
      jest.spyOn(repo, 'find').mockResolvedValue([mockCashDrawerLogs] as any);
      const result = await service.findAll();
      expect(result).toEqual([mockCashDrawerLogs]);
    });
  });

  describe('findOne', () => {
    it('should return a log if found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockCashDrawerLogs as any);
      const result = await service.findOne(1);
      expect(result).toEqual(mockCashDrawerLogs);
    });

    it('should throw NotFoundException if log not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a log', async () => {
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1 } as any);
      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if nothing deleted', async () => {
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 0 } as any);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
