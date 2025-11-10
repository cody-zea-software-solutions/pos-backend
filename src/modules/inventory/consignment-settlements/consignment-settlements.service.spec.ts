import { Test, TestingModule } from '@nestjs/testing';
import { ConsignmentSettlementsService } from './consignment-settlements.service';
import { Repository } from 'typeorm';
import { ConsignmentSettlement } from './consignment-settlement.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConsignorService } from '../consignor/consignor.service';
import { ShopService } from '../../shop/shop.service';
import { UsersService } from '../../users/users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ConsignmentSettlementsService', () => {
  let service: ConsignmentSettlementsService;
  let repo: Repository<ConsignmentSettlement>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockConsignorService = { findOne: jest.fn() };
  const mockShopService = { findOne: jest.fn() };
  const mockUserService = { findOne: jest.fn() };

  const mockSettlement = {
    settlement_id: 1,
    total_sales_amount: 1000,
    total_commission: 100,
    total_payable: 900,
  } as ConsignmentSettlement;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsignmentSettlementsService,
        { provide: getRepositoryToken(ConsignmentSettlement), useValue: mockRepo },
        { provide: ConsignorService, useValue: mockConsignorService },
        { provide: ShopService, useValue: mockShopService },
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<ConsignmentSettlementsService>(ConsignmentSettlementsService);
    repo = module.get<Repository<ConsignmentSettlement>>(getRepositoryToken(ConsignmentSettlement));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should throw if consignor not found', async () => {
      mockConsignorService.findOne.mockResolvedValue(null);
      await expect(
        service.create({
          consignor_id: 1,
          shop_id: 1,
          settlement_period_start: new Date(),
          settlement_period_end: new Date(),
          total_sales_amount: 1000,
          total_commission: 100,
          total_payable: 900,
          processed_by_user: 1,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create settlement successfully', async () => {
      mockConsignorService.findOne.mockResolvedValue({ id: 1 });
      mockShopService.findOne.mockResolvedValue({ id: 2 });
      mockUserService.findOne.mockResolvedValue({ id: 3 });
      mockRepo.create.mockReturnValue(mockSettlement);
      mockRepo.save.mockResolvedValue(mockSettlement);

      const result = await service.create({
        consignor_id: 1,
        shop_id: 2,
        settlement_period_start: new Date(),
        settlement_period_end: new Date(),
        total_sales_amount: 1000,
        total_commission: 100,
        total_payable: 900,
        processed_by_user: 3,
      });

      expect(mockRepo.create).toHaveBeenCalled();
      expect(result).toEqual(mockSettlement);
    });
  });

  describe('findOne()', () => {
    it('should return a settlement', async () => {
      mockRepo.findOne.mockResolvedValue(mockSettlement);
      const result = await service.findOne(1);
      expect(result).toEqual(mockSettlement);
    });

    it('should throw if not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update settlement', async () => {
      mockRepo.findOne.mockResolvedValue(mockSettlement);
      mockRepo.save.mockResolvedValue({ ...mockSettlement, payment_status: 'PAID' });
      const result = await service.update(1, { payment_status: 'PAID' });
      expect(result.payment_status).toBe('PAID');
    });
  });

  describe('remove()', () => {
    it('should remove settlement', async () => {
      mockRepo.findOne.mockResolvedValue(mockSettlement);
      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalledWith(mockSettlement);
    });
  });
});
