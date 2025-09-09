import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Counter } from './counter.entity';
import { Repository } from 'typeorm';
import { CreateCounterDto } from './dto/create-counter.dto';
import { UpdateCounterDto } from './dto/update-counter.dto';
import { ShopService } from '../shop/shop.service';
import { Shop } from '../shop/shop.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class CounterService {
    constructor(
        @InjectRepository(Counter)
        private counterRepo: Repository<Counter>,
        private readonly shopService: ShopService,
        private readonly userService: UsersService,
    ) { }

    async create(dto: CreateCounterDto): Promise<Counter> {
        // check if the assigned shop exists
        const assignedShop = await this.shopService.findOne(dto.shop as number);
        if (!assignedShop) {
            throw new NotFoundException(`Shop with ID ${dto.shop} not found`);
        }

        const currentUser = dto.current_user
            ? await this.userService.findOne(dto.current_user)
            : null;

        const rollbackUser = dto.rollback_by_user
            ? await this.userService.findOne(dto.rollback_by_user)
            : null;

        const { shop, current_user, rollback_by_user, ...counterData } = dto;

        const counter = this.counterRepo.create(counterData);

        counter.shop = assignedShop as Shop;
        if (currentUser) {
            counter.current_user = currentUser as User;
        }
        if (rollbackUser) {
            counter.rollback_by_user = rollbackUser as User;
        }

        return this.counterRepo.save(counter);
    }

    findAll(): Promise<Counter[]> {
        return this.counterRepo.find({
            relations: ['shop', 'current_user', 'rollback_by_user'],
        });
    }

    async findOne(id: number): Promise<Counter> {
        const counter = await this.counterRepo.findOne({
            where: { counter_id: id },
            relations: ['shop', 'current_user', 'rollback_by_user'],
        });
        if (!counter) throw new NotFoundException(`Counter with ID ${id} not found`);
        return counter;
    }

    async update(id: number, dto: UpdateCounterDto): Promise<Counter> {
        const counter = await this.findOne(id);

        Object.assign(counter, {
            ...dto,
            shop: dto.shop ? { shop_id: dto.shop } : counter.shop,
            current_user: dto.current_user
                ? { user_id: dto.current_user }
                : counter.current_user,
            rollback_by_user: dto.rollback_by_user
                ? { user_id: dto.rollback_by_user }
                : counter.rollback_by_user,
        });

        return this.counterRepo.save(counter);
    }

    async remove(id: number): Promise<void> {
        const counter = await this.findOne(id);
        await this.counterRepo.remove(counter);
    }

    async findByCode(counterCode: string): Promise<Counter | null> {
        return this.counterRepo.findOne({
            where: { counter_code: counterCode },
            relations: ['shop', 'current_user'],
        });
    }

}
