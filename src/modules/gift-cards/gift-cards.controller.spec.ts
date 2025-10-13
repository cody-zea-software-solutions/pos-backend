import { Test, TestingModule } from '@nestjs/testing';
import { GiftCardsController } from './gift-cards.controller';
import { GiftCardsService } from './gift-cards.service';

const mockGiftCard = {
  gift_card_id: 1,
  card_number: 'ABC123',
  initial_value: 100,
  current_balance: 100,
  issue_date: new Date(),
  expiry_date: new Date(),
  status: 'ACTIVE',
};

describe('GiftCardsController', () => {
  let controller: GiftCardsController;
  let service: GiftCardsService;

  const mockGiftCardsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByCardNumber: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftCardsController],
      providers: [{ provide: GiftCardsService, useValue: mockGiftCardsService }],
    }).compile();

    controller = module.get<GiftCardsController>(GiftCardsController);
    service = module.get<GiftCardsService>(GiftCardsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      mockGiftCardsService.create.mockResolvedValue(mockGiftCard);
      const result = await controller.create(mockGiftCard as any);
      expect(result).toEqual(mockGiftCard);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of gift cards', async () => {
      mockGiftCardsService.findAll.mockResolvedValue([mockGiftCard]);
      const result = await controller.findAll();
      expect(result).toEqual([mockGiftCard]);
    });
  });

  describe('findOne', () => {
    it('should return one gift card', async () => {
      mockGiftCardsService.findOne.mockResolvedValue(mockGiftCard);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockGiftCard);
    });
  });

  describe('update', () => {
    it('should update a gift card', async () => {
      const updated = { ...mockGiftCard, current_balance: 50 };
      mockGiftCardsService.update.mockResolvedValue(updated);
      const result = await controller.update('1', updated as any);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should call remove with id', async () => {
      mockGiftCardsService.remove.mockResolvedValue(undefined);
      const result = await controller.remove('1');
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findByCardNumber', () => {
    it('should return gift card by card number', async () => {
      mockGiftCardsService.findByCardNumber.mockResolvedValue(mockGiftCard);
      const result = await controller.findByCardNumber('ABC123');
      expect(result).toEqual(mockGiftCard);
    });
  });
});
