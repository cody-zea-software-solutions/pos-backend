import { Test, TestingModule } from '@nestjs/testing';
import { ProductBundlesService } from './product-bundles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductBundle } from './product-bundle.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProductBundleDto } from './dto/create-product-bundle.dto';
import { UpdateProductBundleDto } from './dto/update-product-bundle.dto';
import { BundleType, PricingStrategy, BundleStatus, GstTreatment } from './bundle.enums';

describe('ProductBundlesService', () => {
  let service: ProductBundlesService;
  let repo: jest.Mocked<Repository<ProductBundle>>;

  const mockBundle: ProductBundle = {
    bundle_id: 1,
    bundle_name: 'Starter Pack',
    bundle_code: 'BND001',
    description: 'Basic test bundle',
    bundle_type: BundleType.FIXED,
    bundle_price: 100,
    bundle_cost: 80,
    discount_amount: 10,
    discount_percentage: 10,
    pricing_strategy: PricingStrategy.FIXED_PRICE,
    valid_from: new Date(),
    valid_until: new Date(),
    minimum_items_required: 1,
    maximum_items_allowed: 5,
    allow_item_substitution: false,
    allow_quantity_modification: false,
    hsn_code: 'HSN123',
    gst_rate: 18,
    is_gst_applicable: true,
    gst_treatment: GstTreatment.TAXABLE,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    image_url: '/uploads/product-bundles/img.jpg',
    enable_multi_branch_pricing: false,
    default_pricing_group_id: 0,
    terms_conditions: 'Standard terms',
    stock_quantity: 50,
    track_bundle_inventory: false,
    reorder_level: 10,
    bundle_status: BundleStatus.ACTIVE,
    items: [],
  };

  const mockRepoValue = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductBundlesService,
        { provide: getRepositoryToken(ProductBundle), useValue: mockRepoValue },
      ],
    }).compile();

    service = module.get<ProductBundlesService>(ProductBundlesService);
    repo = module.get(getRepositoryToken(ProductBundle));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------------------------
  // create()
  // ---------------------------
  describe('create()', () => {
    it('should create a new bundle', async () => {
      const dto: CreateProductBundleDto = {
        bundle_name: 'Starter Pack',
        bundle_code: 'BND001',
        bundle_type: BundleType.FIXED,
        bundle_price: 100,
        bundle_cost: 80,
        discount_amount: 10,
        discount_percentage: 10,
        pricing_strategy: PricingStrategy.FIXED_PRICE,
      };

      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(mockBundle);
      repo.save.mockResolvedValue(mockBundle);

      const result = await service.create(dto);
      expect(result).toEqual(mockBundle);
    });

    it('should throw ConflictException if bundle code already exists', async () => {
      repo.findOne.mockResolvedValue(mockBundle);
      const dto = { bundle_code: 'BND001' } as CreateProductBundleDto;

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  // ---------------------------
  // findAll()
  // ---------------------------
  describe('findAll()', () => {
    it('should return all bundles', async () => {
      repo.find.mockResolvedValue([mockBundle]);
      const result = await service.findAll();
      expect(result).toEqual([mockBundle]);
    });
  });

  // ---------------------------
  // findOne()
  // ---------------------------
  describe('findOne()', () => {
    it('should return a bundle by id', async () => {
      repo.findOne.mockResolvedValue(mockBundle);
      const result = await service.findOne(1);
      expect(result).toEqual(mockBundle);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------
  // update()
  // ---------------------------
  describe('update()', () => {
    it('should update a bundle successfully', async () => {
      repo.findOne.mockResolvedValue(mockBundle);
      repo.save.mockResolvedValue({ ...mockBundle, bundle_name: 'Updated Name' });

      const dto: UpdateProductBundleDto = { bundle_name: 'Updated Name' };
      const result = await service.update(1, dto);
      expect(result.bundle_name).toBe('Updated Name');
      expect(repo.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if duplicate bundle_code exists', async () => {
      // Mock repo.findOne to handle both queries
      repo.findOne.mockImplementation(async (query: any) => {
        if (query.where.bundle_id) {
          // bundle being updated
          return mockBundle;
        }
        if (query.where.bundle_code) {
          // duplicate bundle
          return { ...mockBundle, bundle_id: 2 };
        }
        return null;
      });

      const dto: UpdateProductBundleDto = { bundle_code: 'DUPLICATE_CODE' }; 
      await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
    });
  });

  // ---------------------------
  // remove()
  // ---------------------------
  describe('remove()', () => {
    it('should remove a bundle successfully', async () => {
      repo.findOne.mockResolvedValue(mockBundle);
      repo.remove.mockResolvedValue(mockBundle);

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(mockBundle);
    });
  });

  // ---------------------------
  // findByName()
  // ---------------------------
  describe('findByName()', () => {
    it('should return bundles by name', async () => {
      repo.find.mockResolvedValue([mockBundle]);
      const result = await service.findByName('Starter');
      expect(result).toEqual([mockBundle]);
    });
  });

  // ---------------------------
  // findByCode()
  // ---------------------------
  describe('findByCode()', () => {
    it('should return bundle by code', async () => {
      repo.findOne.mockResolvedValue(mockBundle);
      const result = await service.findByCode('BND001');
      expect(result).toEqual(mockBundle);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findByCode('INVALID')).rejects.toThrow(NotFoundException);
    });
  });
});
