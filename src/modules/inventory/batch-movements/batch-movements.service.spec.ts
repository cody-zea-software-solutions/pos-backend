import { Test, TestingModule } from '@nestjs/testing';
import { BatchMovementsService } from './batch-movements.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BatchMovement } from './batch-movement.entity';
import { Batch } from '../batches/batches.entity';
import { Shop } from '../../shop/shop.entity';
import { User } from '../../users/user.entity';
import { ShopInventory } from '../shop-inventory/shop-inventory.entity';
import { UsersService } from '../../users/users.service';
import { CreateBatchMovementDto } from './dto/create-batch-movement.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('BatchMovementsService', () => {
  let service: BatchMovementsService;
  let batchRepo: Repository<Batch>;
  let movementRepo: Repository<BatchMovement>;
  let shopRepo: Repository<Shop>;
  let userRepo: Repository<User>;
  let inventoryRepo: Repository<ShopInventory>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchMovementsService,
        {
          provide: getRepositoryToken(BatchMovement),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Batch),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Shop),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ShopInventory),
          useClass: Repository,
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BatchMovementsService>(BatchMovementsService);
    batchRepo = module.get(getRepositoryToken(Batch));
    movementRepo = module.get(getRepositoryToken(BatchMovement));
    shopRepo = module.get(getRepositoryToken(Shop));
    userRepo = module.get(getRepositoryToken(User));
    inventoryRepo = module.get(getRepositoryToken(ShopInventory));
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if batch not found', async () => {
      jest.spyOn(batchRepo, 'findOne').mockResolvedValue(null);

      const dto: CreateBatchMovementDto = {
        batch_id: 1,
        quantity_moved: 5,
        authorized_by_user: 2,
      };

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if no shops provided', async () => {
      jest.spyOn(batchRepo, 'findOne').mockResolvedValue({ batch_id: 1 } as Batch);
      jest.spyOn(usersService, 'findOne').mockResolvedValue({ user_id: 2 } as User);

      const dto: CreateBatchMovementDto = {
        batch_id: 1,
        quantity_moved: 5,
        authorized_by_user: 2,
      };

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all batch movements', async () => {
      const mockMovements = [{ movement_id: 1 }] as BatchMovement[];
      jest.spyOn(movementRepo, 'find').mockResolvedValue(mockMovements);

      const result = await service.findAll();
      expect(result).toEqual(mockMovements);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if movement not found', async () => {
      jest.spyOn(movementRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return a movement if found', async () => {
      const mockMovement = { movement_id: 1 } as BatchMovement;
      jest.spyOn(movementRepo, 'findOne').mockResolvedValue(mockMovement);

      const result = await service.findOne(1);
      expect(result).toEqual(mockMovement);
    });
  });
});
