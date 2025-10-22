import { Test, TestingModule } from '@nestjs/testing';
import { ProductBundlesController } from './product-bundles.controller';
import { ProductBundlesService } from './product-bundles.service';
import { CreateProductBundleDto } from './dto/create-product-bundle.dto';
import { UpdateProductBundleDto } from './dto/update-product-bundle.dto';
import { BundleType, PricingStrategy } from './bundle.enums';

describe('ProductBundlesController', () => {
  let controller: ProductBundlesController;
  let service: ProductBundlesService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByName: jest.fn(),
    findByCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductBundlesController],
      providers: [{ provide: ProductBundlesService, useValue: mockService }],
    }).compile();

    controller = module.get<ProductBundlesController>(ProductBundlesController);
    service = module.get<ProductBundlesService>(ProductBundlesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create', async () => {
    const dto: CreateProductBundleDto = {
      bundle_name: 'Basic Pack',
      bundle_code: 'BND001',
      bundle_type: BundleType.FIXED,
      bundle_price: 100,
      bundle_cost: 80,
      discount_amount: 10,
      discount_percentage: 5,
      pricing_strategy: PricingStrategy.FIXED_PRICE,
    };

    mockService.create.mockResolvedValue('created');
    const result = await controller.create(dto);
    expect(result).toBe('created');
    expect(mockService.create).toHaveBeenCalledWith(dto, undefined);
  });

  it('should call service.findAll', async () => {
    mockService.findAll.mockResolvedValue(['bundle']);
    const result = await controller.findAll();
    expect(result).toEqual(['bundle']);
  });

  it('should call service.findOne', async () => {
    mockService.findOne.mockResolvedValue('bundle');
    const result = await controller.findOne('1');
    expect(result).toBe('bundle');
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('should call service.update', async () => {
    const dto: UpdateProductBundleDto = { bundle_name: 'Updated' };
    mockService.update.mockResolvedValue('updated');
    const result = await controller.update('1', dto);
    expect(result).toBe('updated');
    expect(mockService.update).toHaveBeenCalledWith(1, dto, undefined);
  });

  it('should call service.remove', async () => {
    mockService.remove.mockResolvedValue(undefined);
    await controller.remove('1');
    expect(mockService.remove).toHaveBeenCalledWith(1);
  });

  it('should call service.findByName', async () => {
    mockService.findByName.mockResolvedValue(['bundle']);
    const result = await controller.findByName('Test');
    expect(result).toEqual(['bundle']);
  });

  it('should call service.findByCode', async () => {
    mockService.findByCode.mockResolvedValue('bundle');
    const result = await controller.findByCode('CODE1');
    expect(result).toBe('bundle');
  });
});
