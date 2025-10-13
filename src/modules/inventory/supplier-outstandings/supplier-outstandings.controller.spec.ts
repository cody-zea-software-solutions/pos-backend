import { Test, TestingModule } from '@nestjs/testing';
import { SupplierOutstandingsController } from './supplier-outstandings.controller';

describe('SupplierOutstandingsController', () => {
  let controller: SupplierOutstandingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierOutstandingsController],
    }).compile();

    controller = module.get<SupplierOutstandingsController>(SupplierOutstandingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
