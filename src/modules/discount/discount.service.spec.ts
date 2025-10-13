import { Test, TestingModule } from '@nestjs/testing';
import { DiscountService } from './discount.service';
import { Repository } from 'typeorm';
import { Discount } from './discount.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('DiscountService', () => {
  let service: DiscountService;
  let repo: Repository<Discount>;

  const mockDiscount = {
    discount_id: 1,
    discount_name: 'Test Discount',
    discount_code: 'TEST10',
    discount_type: 'PERCENTAGE',
    discount_value: 10,
  } as Discount;

  const mockRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountService,
        { provide: getRepositoryToken(Discount), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<DiscountService>(DiscountService);
    repo = module.get<Repository<Discount>>(getRepositoryToken(Discount));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a new discount', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue(mockDiscount);
      mockRepo.save.mockResolvedValue(mockDiscount);

      const result = await service.create(mockDiscount);
      expect(repo.create).toHaveBeenCalledWith(mockDiscount);
      expect(repo.save).toHaveBeenCalledWith(mockDiscount);
      expect(result).toEqual(mockDiscount);
    });

    it('should throw ConflictException if code exists', async () => {
      mockRepo.findOne.mockResolvedValue(mockDiscount);
      await expect(service.create(mockDiscount)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all discounts', async () => {
      mockRepo.find.mockResolvedValue([mockDiscount]);
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual([mockDiscount]);
    });
  });

  describe('findOne', () => {
    it('should return one discount', async () => {
      mockRepo.findOne.mockResolvedValue(mockDiscount);
      const result = await service.findOne(1);
      expect(result).toEqual(mockDiscount);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update discount details', async () => {
      mockRepo.findOne
        .mockResolvedValueOnce(mockDiscount) // for findOne(id)
        .mockResolvedValueOnce(null); // for checking duplicate code

      mockRepo.save.mockResolvedValue({ ...mockDiscount, discount_name: 'Updated' });

      const result = await service.update(1, { discount_name: 'Updated' });
      expect(result.discount_name).toBe('Updated');
    });

    it('should throw ConflictException if discount_code already exists', async () => {
      mockRepo.findOne
        .mockResolvedValueOnce(mockDiscount) // findOne(id)
        .mockResolvedValueOnce(mockDiscount); // duplicate code check

      await expect(service.update(1, { discount_code: 'TEST10' })).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a discount', async () => {
      mockRepo.findOne.mockResolvedValue(mockDiscount);
      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockDiscount);
    });

    it('should throw NotFoundException if discount not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
