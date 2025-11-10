import { Test, TestingModule } from '@nestjs/testing';
import { CashDrawerLogsController } from './cash-drawer-logs.controller';
import { CashDrawerLogsService } from './cash-drawer-logs.service';

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

describe('CashDrawerLogsController', () => {
  let controller: CashDrawerLogsController;
  let service: CashDrawerLogsService;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockCashDrawerLogs),
    findAll: jest.fn().mockResolvedValue([mockCashDrawerLogs]),
    findOne: jest.fn().mockResolvedValue(mockCashDrawerLogs),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashDrawerLogsController],
      providers: [{ provide: CashDrawerLogsService, useValue: mockService }],
    }).compile();

    controller = module.get<CashDrawerLogsController>(CashDrawerLogsController);
    service = module.get<CashDrawerLogsService>(CashDrawerLogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a log', async () => {
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
      expect(await controller.create(dto)).toEqual(mockCashDrawerLogs);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of logs', async () => {
      expect(await controller.findAll()).toEqual([mockCashDrawerLogs]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a log by id', async () => {
      expect(await controller.findOne(1)).toEqual(mockCashDrawerLogs);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });
});
