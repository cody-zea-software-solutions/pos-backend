import { Test, TestingModule } from '@nestjs/testing';
import { ShopService } from './shop.service';
import { Shop } from './shop.entity';
import { Business } from '../business/business.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

type MockRepo<T extends ObjectLiteral = any> = {
  [P in keyof Repository<T>]?: jest.Mock;
};

const createMockRepo = <T extends ObjectLiteral = any>(): MockRepo<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('ShopService', () => {
  let service: ShopService;
  let shopRepo: MockRepo<Shop>;
  let businessRepo: MockRepo<Business>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopService,
        { provide: getRepositoryToken(Shop), useValue: createMockRepo<Shop>() },
        { provide: getRepositoryToken(Business), useValue: createMockRepo<Business>() },
      ],
    }).compile();

    service = module.get<ShopService>(ShopService);
    shopRepo = module.get(getRepositoryToken(Shop));
    businessRepo = module.get(getRepositoryToken(Business));
  });

  describe('create', () => {
    it('should create and return a shop', async () => {
      const dto = { business_id: 1, shop_name: 'Test Shop', shop_code: 'S1' };
      const business: Business = { business_id: 1 } as Business;
      const createdShop: Shop = {
        shop_id: 1,
        shop_name: dto.shop_name,
        shop_code: dto.shop_code,
        business,
      } as unknown as Shop; // 👈 force cast to avoid missing fields error

      businessRepo.findOne!.mockResolvedValue(business);
      shopRepo.create!.mockReturnValue(createdShop);
      shopRepo.save!.mockResolvedValue(createdShop);

      const result = await service.create(dto as any);

      expect(businessRepo.findOne).toHaveBeenCalledWith({
        where: { business_id: dto.business_id },
      });
      expect(shopRepo.create).toHaveBeenCalledWith({ ...dto, business });
      expect(result).toEqual(createdShop);
    });

    it('should throw NotFoundException if business does not exist', async () => {
      const dto = { business_id: 999, shop_name: 'Test Shop', shop_code: 'S1' };
      businessRepo.findOne!.mockResolvedValue(null);

      await expect(service.create(dto as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of shops', async () => {
      const shops = [{ shop_id: 1 } as Shop];
      shopRepo.find!.mockResolvedValue(shops);

      const result = await service.findAll();

      expect(shopRepo.find).toHaveBeenCalledWith({ relations: ['business'] });
      expect(result).toEqual(shops);
    });
  });

  describe('findOne', () => {
    it('should return a shop by id', async () => {
      const shop = { shop_id: 1 } as Shop;
      shopRepo.findOne!.mockResolvedValue(shop);

      const result = await service.findOne(1);

      expect(shopRepo.findOne).toHaveBeenCalledWith({
        where: { shop_id: 1 },
        relations: ['business'],
      });
      expect(result).toEqual(shop);
    });

    it('should throw NotFoundException if shop not found', async () => {
      shopRepo.findOne!.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the shop', async () => {
      const existingShop = { shop_id: 1, shop_name: 'Old Shop' } as Shop;
      const dto = { shop_name: 'Updated Shop' };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingShop);
      shopRepo.save!.mockResolvedValue({ ...existingShop, ...dto });

      const result = await service.update(1, dto as any);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(shopRepo.save).toHaveBeenCalledWith({ ...existingShop, ...dto });
      expect(result.shop_name).toBe('Updated Shop');
    });

    it('should throw NotFoundException if new business_id not found', async () => {
      const existingShop = { shop_id: 1 } as Shop;
      jest.spyOn(service, 'findOne').mockResolvedValue(existingShop);
      businessRepo.findOne!.mockResolvedValue(null);

      await expect(service.update(1, { business_id: 999 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the shop', async () => {
      const shop = { shop_id: 1 } as Shop;
      jest.spyOn(service, 'findOne').mockResolvedValue(shop);
      shopRepo.remove!.mockResolvedValue(shop);

      const result = await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(shopRepo.remove).toHaveBeenCalledWith(shop);
      expect(result).toEqual(shop);
    });
  });
});
