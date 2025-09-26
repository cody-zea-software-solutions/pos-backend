import { Test, TestingModule } from '@nestjs/testing';
import { CounterController } from './counter.controller';
import { CounterService } from './counter.service';
import { CreateCounterDto } from './dto/create-counter.dto';
import { UpdateCounterDto } from './dto/update-counter.dto';

describe('CounterController', () => {
  let controller: CounterController;
  let service: CounterService;

  const mockCounterService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounterController],
      providers: [
        {
          provide: CounterService,
          useValue: mockCounterService,
        },
      ],
    }).compile();

    controller = module.get<CounterController>(CounterController);
    service = module.get<CounterService>(CounterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create with dto', async () => {
    const dto: CreateCounterDto = {
      shop: 1,
      counter_name: 'Main Counter',
      counter_code: 'C001',
      counter_type: 'POS',
    };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.findAll', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne with id', async () => {
    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should call service.update with id and dto', async () => {
    const dto: UpdateCounterDto = { counter_name: 'Updated Counter' };
    await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call service.remove with id', async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
