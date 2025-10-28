import { Test, TestingModule } from '@nestjs/testing';
import { BatchMovementsController } from './batch-movements.controller';
import { BatchMovementsService } from './batch-movements.service';
import { CreateBatchMovementDto } from './dto/create-batch-movement.dto';
import { BatchMovement } from './batch-movement.entity';

describe('BatchMovementsController', () => {
  let controller: BatchMovementsController;
  let service: BatchMovementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchMovementsController],
      providers: [
        {
          provide: BatchMovementsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BatchMovementsController>(BatchMovementsController);
    service = module.get<BatchMovementsService>(BatchMovementsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const dto: CreateBatchMovementDto = {
        batch_id: 1,
        quantity_moved: 10,
        authorized_by_user: 2,
      };
      const expectedResult: Partial<BatchMovement> = {
  movement_id: 1,
 batch: { batch_id: 1 } as any,
  quantity_moved: 10,
  authorized_by_user: { user_id: 2 } as any,
};
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as BatchMovement);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of batch movements', async () => {
      const mockData = [{ movement_id: 1 }] as BatchMovement[];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockData);

      const result = await controller.findAll();
      expect(result).toEqual(mockData);
    });
  });

  describe('findOne', () => {
    it('should return a single batch movement', async () => {
      const mockMovement = { movement_id: 1 } as BatchMovement;
      jest.spyOn(service, 'findOne').mockResolvedValue(mockMovement);

      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMovement);
    });
  });
});
