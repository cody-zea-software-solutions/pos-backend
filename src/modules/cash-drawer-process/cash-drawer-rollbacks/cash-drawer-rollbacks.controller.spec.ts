import { Test, TestingModule } from '@nestjs/testing';
import { CashDrawerRollbacksController } from './cash-drawer-rollbacks.controller';
import { CashDrawerRollbacksService } from './cash-drawer-rollbacks.service';
import { CreateCashDrawerRollbackDto } from './dto/create-cash-drawer-rollbacks.dto';

describe('CashDrawerRollbacksController', () => {
  let controller: CashDrawerRollbacksController;
  let service: CashDrawerRollbacksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashDrawerRollbacksController],
      providers: [
        {
          provide: CashDrawerRollbacksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            // update and remove commented out in  controller,
          },
        },
      ],
    }).compile();

    controller = module.get<CashDrawerRollbacksController>(CashDrawerRollbacksController);
    service = module.get<CashDrawerRollbacksService>(CashDrawerRollbacksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      const dto: CreateCashDrawerRollbackDto = {
        counter_id: 1,
        shift_id: 1,
        rollback_amount: 100,
        balance_before_rollback: 1000,
        balance_after_rollback: 900,
        rollback_reason: 'Test rollback',
        rollback_time: '2025-11-09T10:30:00Z',
        performed_by_user: 1,
        authorized_by_user: 1,
        reference_transaction: 'TXN123',
        is_approved: true,
        approval_notes: 'Approved',
      };

      const result = { rollback_id: 1, ...dto };

      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(dto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return result', async () => {
      const result = [{ rollback_id: 1 }, { rollback_id: 2 }];

      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return result', async () => {
      const id = 1;
      const result = { rollback_id: id };

      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

      expect(await controller.findOne(id)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });
});
