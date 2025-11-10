import { Test, TestingModule } from '@nestjs/testing';
import { ServiceResourcesController } from './service-resources.controller';

describe('ServiceResourcesController', () => {
  let controller: ServiceResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceResourcesController],
    }).compile();

    controller = module.get<ServiceResourcesController>(ServiceResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
