import { Test, TestingModule } from '@nestjs/testing';
import { GstReturnService } from './gst-return.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GstReturn } from './gst-return.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('GstReturnService', () => {
  let service: GstReturnService;
  let repo: Repository<GstReturn>;

  const mockGstReturn = { return_id: 1, shop_id: 100, return_type: 'GSTR1' };

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockGstReturn),
    save: jest.fn().mockResolvedValue(mockGstReturn),
    find: jest.fn().mockResolvedValue([mockGstReturn]),
    findOne: jest.fn().mockResolvedValue(mockGstReturn),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GstReturnService,
        {
          provide: getRepositoryToken(GstReturn),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<GstReturnService>(GstReturnService);
    repo = module.get<Repository<GstReturn>>(getRepositoryToken(GstReturn));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new GST return', async () => {
      const dto = { shop_id: 100, return_type: 'GSTR1' } as GstReturn;
      const result = await service.create(dto as any);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockGstReturn);
    });
  });

  describe('findAll', () => {
    it('should return all GST returns', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockGstReturn]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a GST return', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockGstReturn);
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an existing GST return', async () => {
      const dto = { status: 'FILED' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockGstReturn as any);
      const result = await service.update(1, dto as any);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockGstReturn);
    });
  });

  describe('remove', () => {
    it('should remove a GST return', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockGstReturn as any);
      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockGstReturn);
    });
  });
});
