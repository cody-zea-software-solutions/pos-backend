import { Test, TestingModule } from '@nestjs/testing';
import { ServiceResourcesService } from './service-resources.service';

describe('ServiceResourcesService', () => {
  let service: ServiceResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceResourcesService],
    }).compile();

    service = module.get<ServiceResourcesService>(ServiceResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
