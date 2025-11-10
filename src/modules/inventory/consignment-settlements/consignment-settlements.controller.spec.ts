import { Test, TestingModule } from '@nestjs/testing';
import { ConsignmentSettlementsController } from './consignment-settlements.controller';
import { ConsignmentSettlementsService } from './consignment-settlements.service';
import { CreateConsignmentSettlementDto } from './dto/create-consignment-settlement.dto';
import { UpdateConsignmentSettlementDto } from './dto/update-consignment-settlement.dto';

describe('ConsignmentSettlementsController', () => {
  let controller: ConsignmentSettlementsController;
  let service: ConsignmentSettlementsService;

  const mockSettlement = {
    settlement_id: 1,
    total_sales_amount: 1000,
    total_commission: 100,
    total_payable: 900,
    payment_status: 'PENDING',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockSettlement),
    findAll: jest.fn().mockResolvedValue([mockSettlement]),
    findOne: jest.fn().mockResolvedValue(mockSettlement),
    update: jest.fn().mockResolvedValue({ ...mockSettlement, payment_status: 'PAID' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsignmentSettlementsController],
      providers: [
        {
          provide: ConsignmentSettlementsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ConsignmentSettlementsController>(ConsignmentSettlementsController);
    service = module.get<ConsignmentSettlementsService>(ConsignmentSettlementsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a settlement', async () => {
    const dto: CreateConsignmentSettlementDto = {
      consignor_id: 1,
      shop_id: 2,
      settlement_period_start: new Date(),
      settlement_period_end: new Date(),
      total_sales_amount: 1000,
      total_commission: 100,
      total_payable: 900,
      processed_by_user: 1,
    };
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockSettlement);
  });

  it('should return all settlements', async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockSettlement]);
  });

  it('should return one settlement', async () => {
    const result = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockSettlement);
  });

  it('should update a settlement', async () => {
    const dto: UpdateConsignmentSettlementDto = { payment_status: 'PAID' };
    const result = await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result.payment_status).toBe('PAID');
  });

  it('should delete a settlement', async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
