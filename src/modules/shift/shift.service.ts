import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shift } from './shift.entity';
import { IsNull, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ShopService } from '../shop/shop.service';
import { CounterService } from '../counter/counter.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { User } from '../users/user.entity';
import { Counter } from '../counter/counter.entity';

@Injectable()
export class ShiftService {
    constructor(
        @InjectRepository(Shift)
        private readonly shiftRepo: Repository<Shift>,
        @InjectRepository(Counter)
        private counterRepo: Repository<Counter>,
        private readonly userService: UsersService,
        private readonly shopService: ShopService,
        private readonly counterService: CounterService,
    ) { }

    async create(dto: CreateShiftDto): Promise<Shift> {
        // Validate relations
        const user = await this.userService.findOne(dto.user_id);
        if (!user) throw new NotFoundException(`User ${dto.user_id} not found`);

        const shop = await this.shopService.findOne(dto.shop_id);
        if (!shop) throw new NotFoundException(`Shop ${dto.shop_id} not found`);

        const counter = await this.counterService.findOne(dto.counter_id);
        if (!counter) throw new NotFoundException(`Counter ${dto.counter_id} not found`);

        const { user_id, shop_id, counter_id, ...shiftData } = dto;
        const shift = this.shiftRepo.create(shiftData);

        shift.user = user;
        shift.shop = shop;
        shift.counter = counter;

        // auto-calc cash difference if closing provided
        if (shift.opening_cash != null && shift.closing_cash != null) {
            shift.cash_difference = shift.closing_cash - shift.opening_cash;
        } else {
            shift.cash_difference = 0;
        }

        // expected_cash logic ( to be implemented properly later) --------------------
        if (!shift.expected_cash) {
            shift.expected_cash = 0;
        }

        return this.shiftRepo.save(shift);
    }

    async findAll(): Promise<Shift[]> {
        return this.shiftRepo.find({
            relations: ['user', 'shop', 'counter'],
        });
    }

    async findOne(id: number): Promise<Shift> {
        const shift = await this.shiftRepo.findOne({
            where: { shift_id: id },
            relations: ['user', 'shop', 'counter'],
        });
        if (!shift) throw new NotFoundException(`Shift ${id} not found`);
        return shift;
    }

    async update(id: number, dto: UpdateShiftDto): Promise<Shift> {
        const shift = await this.findOne(id);

        if (dto.user_id) {
            const user = await this.userService.findOne(dto.user_id);
            if (!user) throw new NotFoundException(`User ${dto.user_id} not found`);
            shift.user = user;
        }

        if (dto.shop_id) {
            const shop = await this.shopService.findOne(dto.shop_id);
            if (!shop) throw new NotFoundException(`Shop ${dto.shop_id} not found`);
            shift.shop = shop;
        }

        if (dto.counter_id) {
            const counter = await this.counterService.findOne(dto.counter_id);
            if (!counter) throw new NotFoundException(`Counter ${dto.counter_id} not found`);
            shift.counter = counter;
        }

        Object.assign(shift, dto);

        // recalc cash difference if both opening & closing are present
        if (shift.opening_cash != null && shift.closing_cash != null) {
            shift.cash_difference = shift.closing_cash - shift.opening_cash;
        }

        return this.shiftRepo.save(shift);
    }

    async remove(id: number): Promise<void> {
        const shift = await this.findOne(id);
        await this.shiftRepo.remove(shift);
    }

    // Auto-start shift when cashier logs in
    async startShiftForCashier(userId: number, counter: Counter): Promise<Shift> {
        const user = await this.userService.findOne(userId);
        if (!user) throw new NotFoundException(`User ${userId} not found`);

        // check if user already has an active shift
        const activeShift = await this.shiftRepo.findOne({
            where: { user: { user_id: userId }, shift_end: IsNull(), },
            relations: ['user', 'shop', 'counter'],
        });

        if (activeShift) {
            return activeShift; // don't create duplicates
        }

        const shift = this.shiftRepo.create({
            shift_start: new Date(),
            opening_cash: 0,
            expected_cash: 0,
            cash_difference: 0,
            status: 'OPEN',
        });

        shift.user = user;
        shift.shop = user.assigned_shop ?? null;
        shift.counter = counter;

        counter.current_user = user;
        counter.status = 'OPEN';
        await this.counterRepo.save(counter);

        return this.shiftRepo.save(shift);
    }

    // Auto-end shift when cashier logs out
    async endShiftForCashier(userId: number): Promise<Shift | null> {

            const user = await this.userService.findOne(userId);
            if (!user) throw new NotFoundException(`User ${userId} not found`);

            const activeShift = await this.shiftRepo.findOne({
                where: { user: { user_id: userId }, shift_end: IsNull() },
                relations: ['counter'],
            });

            if (!activeShift) return null;

            activeShift.shift_end = new Date();
            activeShift.status = 'CLOSED';

            // Free the counter if assigned
            if (activeShift.counter) {
                activeShift.counter.current_user = null;
                activeShift.counter.status = 'CLOSED';
                await this.counterRepo.save(activeShift.counter);
            }

            return this.shiftRepo.save(activeShift);
    }
}

