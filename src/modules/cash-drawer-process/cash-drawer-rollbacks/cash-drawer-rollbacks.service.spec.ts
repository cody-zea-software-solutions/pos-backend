import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashDrawerRollback } from './cash-drawer-rollbacks.entity';
import { CashDrawerRollbacksService } from './cash-drawer-rollbacks.service';
import { NotFoundException } from '@nestjs/common';

describe('CashDrawerRollbacksService', () => {
  let service: CashDrawerRollbacksService;
  let repo: Repository<CashDrawerRollback>;

  const mockRollback = {
    rollback_id: 1,
    rollback_amount: 100,
    balance_before_rollback: 1000,
    balance_after_rollback: 900,
    rollback_reason: 'Test rollback',
    rollback_time: new Date('2025-11-09T10:30:00Z'),
    reference_transaction: 'TXN123',
    is_approved: true,
    approval_notes: 'Approved',
    counter: { counter_id: 1 },
    shift: { shift_id: 1 },
    performed_by_user: { user_id: 1 },
    authorized_by_user: { user_id: 1 },
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashDrawerRollbacksService,
        {
          provide: getRepositoryToken(CashDrawerRollback),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CashDrawerRollbacksService>(CashDrawerRollbacksService);
    repo = module.get<Repository<CashDrawerRollback>>(getRepositoryToken(CashDrawerRollback));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a rollback entity', async () => {
      mockRepository.create.mockReturnValue(mockRollback);
      mockRepository.save.mockResolvedValue(mockRollback);
      mockRepository.findOne.mockResolvedValue(mockRollback);

      const dto = {
        rollback_amount: 100,
        balance_before_rollback: 1000,
        balance_after_rollback: 900,
        rollback_reason: 'Test rollback',
        rollback_time: '2025-11-09T10:30:00Z',
        reference_transaction: 'TXN123',
        is_approved: true,
        approval_notes: 'Approved',
        counter_id: 1,
        shift_id: 1,
        performed_by_user: 1,
        authorized_by_user: 1,
      };

      const result = await service.create(dto as any);

      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(mockRollback);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { rollback_id: mockRollback.rollback_id },
        relations: ['counter', 'shift', 'performed_by_user', 'authorized_by_user'],
      });
      expect(result).toEqual(mockRollback);
    });

    it('should throw NotFoundException if reloaded rollback not found', async () => {
      mockRepository.create.mockReturnValue(mockRollback);
      mockRepository.save.mockResolvedValue(mockRollback);
      mockRepository.findOne.mockResolvedValue(null);

      const dto = {
        rollback_amount: 100,
        balance_before_rollback: 1000,
        balance_after_rollback: 900,
        rollback_reason: 'Test rollback',
        rollback_time: '2025-11-09T10:30:00Z',
        reference_transaction: 'TXN123',
        is_approved: true,
        approval_notes: 'Approved',
        counter_id: 1,
        shift_id: 1,
        performed_by_user: 1,
        authorized_by_user: 1,
      };

      await expect(service.create(dto as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of rollbacks', async () => {
      mockRepository.find.mockResolvedValue([mockRollback]);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['counter', 'shift', 'performed_by_user', 'authorized_by_user'],
        order: { rollback_time: 'DESC' },
      });
      expect(result).toEqual([mockRollback]);
    });
  });

  describe('findOne', () => {
    it('should return a rollback by ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockRollback);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { rollback_id: 1 },
        relations: ['counter', 'shift', 'performed_by_user', 'authorized_by_user'],
      });
      expect(result).toEqual(mockRollback);
    });

    it('should throw NotFoundException if rollback not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete rollback if found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toBeUndefined();

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if rollback not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
