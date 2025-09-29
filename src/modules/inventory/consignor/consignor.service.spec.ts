import { Test, TestingModule } from '@nestjs/testing';
import { ConsignorService } from './consignor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Consignor } from './consignor.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ConsignorService', () => {
  let service: ConsignorService;
  let repo: Repository<Consignor>;

  const mockConsignor = { consignor_id: 1, consignor_name: 'Test', consignor_code: 'C001' } as Consignor;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsignorService,
        {
          provide: getRepositoryToken(Consignor),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ConsignorService>(ConsignorService);
    repo = module.get<Repository<Consignor>>(getRepositoryToken(Consignor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if consignor_code exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockConsignor);
      await expect(service.create(mockConsignor)).rejects.toThrow(ConflictException);
    });

    it('should save a new consignor if code is unique', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockConsignor);
      mockRepository.save.mockResolvedValue(mockConsignor);

      const result = await service.create(mockConsignor);
      expect(result).toEqual(mockConsignor);
    });
  });

  describe('findAll', () => {
    it('should return all consignors', async () => {
      mockRepository.find.mockResolvedValue([mockConsignor]);
      const result = await service.findAll();
      expect(result).toEqual([mockConsignor]);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if consignor not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return consignor if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockConsignor);
      const result = await service.findOne(1);
      expect(result).toEqual(mockConsignor);
    });
  });

  describe('update', () => {
    it('should throw ConflictException if code already exists', async () => {
      mockRepository.findOne
        .mockResolvedValueOnce(mockConsignor) // for findOne
        .mockResolvedValueOnce({ consignor_id: 2, consignor_code: 'C002' }); // for code check

      await expect(service.update(1, { consignor_code: 'C002' })).rejects.toThrow(ConflictException);
    });

    it('should update and save consignor', async () => {
      mockRepository.findOne.mockResolvedValue(mockConsignor);
      mockRepository.save.mockResolvedValue({ ...mockConsignor, consignor_name: 'Updated' });

      const result = await service.update(1, { consignor_name: 'Updated' });
      expect(result.consignor_name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should remove consignor', async () => {
      mockRepository.findOne.mockResolvedValue(mockConsignor);
      mockRepository.remove.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.not.toThrow();
      expect(mockRepository.remove).toHaveBeenCalledWith(mockConsignor);
    });
  });
});
