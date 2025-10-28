import { Test, TestingModule } from '@nestjs/testing';
import { BatchesController } from './batches.controller';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Batch } from './batches.entity';
import { User } from '../../users/user.entity';
import { Product } from '../../product-management/product/product.entity';

describe('BatchesController', () => {
  let controller: BatchesController;
  let service: BatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchesController],
      providers: [
        {
          provide: BatchesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BatchesController>(BatchesController);
    service = module.get<BatchesService>(BatchesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const dto: CreateBatchDto = {
        batch_number: 'BATCH-123',
        product_id: 1,
        initial_quantity: 100,
        cost_price_per_unit: 10.5,
        selling_price_per_unit: 15,
        created_by_user: 2,
      };

      const expectedResult: Partial<Batch> = {
        batch_id: 1,
        batch_number: 'BATCH-123',
        product: { product_id: 1 } as Product,
        created_by_user: { user_id: 2 } as User,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as Batch);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all batches', async () => {
      const mockData = [{ batch_id: 1 }, { batch_id: 2 }] as Batch[];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockData);

      const result = await controller.findAll();
      expect(result).toEqual(mockData);
    });
  });

  describe('findOne', () => {
    it('should return a batch by id', async () => {
      const mockBatch = { batch_id: 1 } as Batch;
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBatch);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockBatch);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const dto: UpdateBatchDto = { notes: 'Updated notes' };
      const updated = { batch_id: 1, notes: 'Updated notes' } as Batch;

      jest.spyOn(service, 'update').mockResolvedValue(updated);

      const result = await controller.update(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
