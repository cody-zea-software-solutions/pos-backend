import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GiftCard } from './gift-card.entity';
import { Repository } from 'typeorm';
import { CustomerService } from '../loyalty-management/customer/customer.service';
import { UsersService } from '../users/users.service';
import { CreateGiftCardDto } from './dto/create-gift-card.dto';
import { UpdateGiftCardDto } from './dto/update-gift-card.dto';

@Injectable()
export class GiftCardsService {
    constructor(
        @InjectRepository(GiftCard)
        private readonly giftCardRepo: Repository<GiftCard>,
        private readonly customerService: CustomerService,
        private readonly userService: UsersService,
    ) { }

    async create(dto: CreateGiftCardDto): Promise<GiftCard> {
        const exists = await this.giftCardRepo.findOne({ where: { card_number: dto.card_number } });
        if (exists) throw new ConflictException(`Card number '${dto.card_number}' already exists`);

        const customer = dto.issued_to_customer
            ? await this.customerService.findOne(dto.issued_to_customer)
            : null;

        const user = dto.issued_by_user
            ? await this.userService.findOne(dto.issued_by_user)
            : null;

        const { issued_to_customer, issued_by_user, ...data } = dto;
        const giftCard = this.giftCardRepo.create(data);

        if (customer) giftCard.issued_to = customer;
        if (user) giftCard.issued_by = user;

        return this.giftCardRepo.save(giftCard);
    }

    async findAll(): Promise<GiftCard[]> {
        return this.giftCardRepo.find({ relations: ['issued_to', 'issued_by'] });
    }

    async findOne(id: number): Promise<GiftCard> {
        const giftCard = await this.giftCardRepo.findOne({
            where: { gift_card_id: id },
            relations: ['issued_to', 'issued_by'],
        });
        if (!giftCard) throw new NotFoundException(`GiftCard ${id} not found`);
        return giftCard;
    }

    async update(id: number, dto: UpdateGiftCardDto): Promise<GiftCard> {
        const giftCard = await this.findOne(id);

        if (dto.card_number && dto.card_number !== giftCard.card_number) {
            const exists = await this.giftCardRepo.findOne({ where: { card_number: dto.card_number } });
            if (exists) throw new ConflictException(`Card number '${dto.card_number}' already exists`);
        }

        const customer = dto.issued_to_customer
            ? await this.customerService.findOne(dto.issued_to_customer)
            : null;

        const user = dto.issued_by_user
            ? await this.userService.findOne(dto.issued_by_user)
            : null;

        const { issued_to_customer, issued_by_user, ...data } = dto;
        Object.assign(giftCard, data);

        if (customer) giftCard.issued_to = customer;
        if (user) giftCard.issued_by = user;

        return this.giftCardRepo.save(giftCard);
    }

    async remove(id: number): Promise<void> {
        const giftCard = await this.findOne(id);
        await this.giftCardRepo.remove(giftCard);
    }

    async findByCardNumber(card_number: string): Promise<GiftCard> {
        const card = await this.giftCardRepo.findOne({
            where: { card_number },
            relations: ['issued_to', 'issued_by'],
        });
        if (!card) throw new NotFoundException(`Gift card '${card_number}' not found`);
        return card;
    }
}
