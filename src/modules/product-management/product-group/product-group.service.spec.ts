import { Test, TestingModule } from '@nestjs/testing';
import { ProductGroupService } from './product-group.service';
import { ProductGroup } from './product-group.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductGroupService', () => {
  let service: ProductGroupService;
  let repo: jest.Mocked<Repository<ProductGroup>>;

  const mockGroup: ProductGroup = {
    group_id: 1,
    group_code: 'GRP001',
    group_name: 'Electronics',
    description: '',
    sort_order: 0,
    is_active: true,
    created_at: new Date(),
    group_color: '',
    group_icon: '',
    default_hsn_code: '',
    default_gst_rate: 0,
    categories: [],
    products: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductGroupService,
        {
          provide: getRepositoryToken(ProductGroup),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductGroupService>(ProductGroupService);
    repo = module.get(getRepositoryToken(ProductGroup));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw conflict if group_code exists', async () => {
      repo.findOne.mockResolvedValue(mockGroup);
      await expect(
        service.create({ group_code: 'GRP001', group_name: 'Test' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should create and save a group', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(mockGroup);
      repo.save.mockResolvedValue(mockGroup);

      const result = await service.create({ group_code: 'GRP002', group_name: 'Phones' } as any);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockGroup);
    });
  });

  describe('findAll', () => {
    it('should return all groups', async () => {
      repo.find.mockResolvedValue([mockGroup]);
      const result = await service.findAll();
      expect(result).toEqual([mockGroup]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw not found if missing', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return a group', async () => {
      repo.findOne.mockResolvedValue(mockGroup);
      const result = await service.findOne(1);
      expect(result).toEqual(mockGroup);
    });
  });

  describe('update', () => {
    it('should update and save a group', async () => {
      repo.findOne.mockResolvedValue(mockGroup);
      repo.save.mockResolvedValue({ ...mockGroup, group_name: 'Updated' });

      const result = await service.update(1, { group_name: 'Updated' });
      expect(result.group_name).toEqual('Updated');
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a group', async () => {
      repo.findOne.mockResolvedValue(mockGroup);
      repo.remove.mockResolvedValue(mockGroup);

      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockGroup);
    });
  });
});
