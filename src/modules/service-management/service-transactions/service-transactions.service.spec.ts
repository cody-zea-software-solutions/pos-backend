/*import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTransactionsService } from './service-transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServiceTransaction } from './service-transactions.entity';

describe('ServiceTransactionsService', () => {
  let service: ServiceTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceTransactionsService,
        {
          provide: getRepositoryToken(ServiceTransaction),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ServiceTransactionsService>(ServiceTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});*/
