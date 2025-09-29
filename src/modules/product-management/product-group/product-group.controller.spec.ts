import { Test, TestingModule } from '@nestjs/testing';
import { ProductGroupController } from './product-group.controller';
import { ProductGroupService } from './product-group.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('ProductGroupController', () => {
  let controller: ProductGroupController;
  let service: ProductGroupService;

  const mockGroup = { group_id: 1, group_code: 'GRP001', group_name: 'Electronics' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductGroupController],
      providers: [
        {
          provide: ProductGroupService,
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

    controller = module.get<ProductGroupController>(ProductGroupController);
    service = module.get<ProductGroupService>(ProductGroupService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create', async () => {
      (service.create as jest.Mock).mockResolvedValue(mockGroup);
      const result = await controller.create({ group_code: 'GRP001', group_name: 'Electronics' });
      expect(result).toEqual(mockGroup);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all groups', async () => {
      (service.findAll as jest.Mock).mockResolvedValue([mockGroup]);
      const result = await controller.findAll();
      expect(result).toEqual([mockGroup]);
    });
  });

  describe('findOne', () => {
    it('should return group by id', async () => {
      (service.findOne as jest.Mock).mockResolvedValue(mockGroup);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockGroup);
    });
  });

  describe('update', () => {
    it('should update group', async () => {
      (service.update as jest.Mock).mockResolvedValue({ ...mockGroup, group_name: 'Updated' });
      const result = await controller.update(1, { group_name: 'Updated' });
      expect(result.group_name).toEqual('Updated');
      expect(service.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove group', async () => {
      (service.remove as jest.Mock).mockResolvedValue(undefined);
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
