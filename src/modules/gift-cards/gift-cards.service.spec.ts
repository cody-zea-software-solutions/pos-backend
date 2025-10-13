import { Test, TestingModule } from '@nestjs/testing';
import { GiftCardsService } from './gift-cards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GiftCard } from './gift-card.entity';
import { Repository } from 'typeorm';
import { CustomerService } from '../loyalty-management/customer/customer.service';
import { UsersService } from '../users/users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockGiftCard: GiftCard = {
  gift_card_id: 1,
  card_number: 'ABC123',
  initial_value: 100,
  current_balance: 100,
  issue_date: new Date(),
  expiry_date: new Date(),
  issued_to: null as unknown as any,  // 👈 cast
  issued_by: null as unknown as any,      // 👈 cast
  status: 'ACTIVE',
  last_used: null as unknown as Date,

};

describe('GiftCardsService', () => {
  let service: GiftCardsService;
  let repo: jest.Mocked<Repository<GiftCard>>;

  const mockGiftCardRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockCustomerService = { findOne: jest.fn() };
  const mockUserService = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GiftCardsService,
        { provide: getRepositoryToken(GiftCard), useValue: mockGiftCardRepo },
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<GiftCardsService>(GiftCardsService);
    repo = module.get(getRepositoryToken(GiftCard));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------------------------
  // create()
  // ---------------------------
  it('should create a new gift card', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.create.mockReturnValue(mockGiftCard);
    repo.save.mockResolvedValue(mockGiftCard);

    const result = await service.create({
      card_number: 'ABC123',
      initial_value: 100,
      current_balance: 100,
      issue_date: new Date(),
      expiry_date: new Date(),
    });

    expect(result).toEqual(mockGiftCard);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw ConflictException if card number exists', async () => {
    repo.findOne.mockResolvedValue(mockGiftCard);
    await expect(
      service.create({
        card_number: 'ABC123',
        initial_value: 100,
        current_balance: 100,
        issue_date: new Date(),
        expiry_date: new Date(),
      }),
    ).rejects.toThrow(ConflictException);
  });

  // ---------------------------
  // findAll()
  // ---------------------------
  it('should return all gift cards', async () => {
    repo.find.mockResolvedValue([mockGiftCard]);
    const result = await service.findAll();
    expect(result).toEqual([mockGiftCard]);
    expect(repo.find).toHaveBeenCalledWith({ relations: ['issued_to', 'issued_by'] });
  });

  // ---------------------------
  // findOne()
  // ---------------------------
  it('should return one gift card', async () => {
    repo.findOne.mockResolvedValue(mockGiftCard);
    const result = await service.findOne(1);
    expect(result).toEqual(mockGiftCard);
  });

  it('should throw NotFoundException if gift card not found', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  // ---------------------------
  // update()
  // ---------------------------
  it('should update a gift card successfully', async () => {
    repo.findOne.mockResolvedValueOnce(mockGiftCard); // for findOne(id)
    repo.findOne.mockResolvedValueOnce(null); // for checking duplicate card_number
    repo.save.mockResolvedValue({ ...mockGiftCard, current_balance: 50 });

    const result = await service.update(1, { current_balance: 50 });
    expect(result.current_balance).toBe(50);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw ConflictException if updating with duplicate card_number', async () => {
    repo.findOne.mockResolvedValueOnce(mockGiftCard); // findOne(id)
    repo.findOne.mockResolvedValueOnce({ ...mockGiftCard, gift_card_id: 2 }); // duplicate
    await expect(service.update(1, { card_number: 'ABC123' })).rejects.toThrow(ConflictException);
  });

  // ---------------------------
  // remove()
  // ---------------------------
  it('should remove a gift card', async () => {
    repo.findOne.mockResolvedValue(mockGiftCard);
    repo.remove.mockResolvedValue(mockGiftCard);

    await service.remove(1);
    expect(repo.remove).toHaveBeenCalledWith(mockGiftCard);
  });

  it('should throw NotFoundException if removing non-existing card', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });

  // ---------------------------
  // findByCardNumber()
  // ---------------------------
  it('should return gift card by card_number', async () => {
    repo.findOne.mockResolvedValue(mockGiftCard);
    const result = await service.findByCardNumber('ABC123');
    expect(result).toEqual(mockGiftCard);
  });

  it('should throw NotFoundException if card number not found', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findByCardNumber('ZZZ999')).rejects.toThrow(NotFoundException);
  });
});
