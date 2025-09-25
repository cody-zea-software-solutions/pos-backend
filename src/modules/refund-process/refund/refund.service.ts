import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Refund } from './refund.entity';
import { Repository } from 'typeorm';
import { TransactionsService } from 'src/modules/pos-transactions/transactions/transactions.service';
import { ShopService } from 'src/modules/shop/shop.service';
import { CounterService } from 'src/modules/counter/counter.service';
import { CustomerService } from 'src/modules/loyalty-management/customer/customer.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreateRefundDto } from './dto/create-refund.dto';

@Injectable()
export class RefundService {
    constructor(
        @InjectRepository(Refund)
        private readonly refundRepo: Repository<Refund>,
        private readonly transactionService: TransactionsService,
        private readonly shopService: ShopService,
        private readonly counterService: CounterService,
        private readonly customerService: CustomerService,
        private readonly userService: UsersService,
    ) { }

    async create(dto: CreateRefundDto): Promise<Refund> {
        const exists = await this.refundRepo.findOne({ where: { refund_number: dto.refund_number } });
        if (exists) throw new ConflictException(`Refund number '${dto.refund_number}' already exists`);

        const transaction = await this.transactionService.findOne(dto.original_transaction_id);
        if (!transaction) throw new NotFoundException(`Transaction ${dto.original_transaction_id} not found`);

        const shop = dto.shop_id ? await this.shopService.findOne(dto.shop_id) : null;
        const counter = dto.counter_id ? await this.counterService.findOne(dto.counter_id) : null;
        const customer = dto.customer_id ? await this.customerService.findOne(dto.customer_id) : null;
        const processed_by = dto.processed_by_user ? await this.userService.findOne(dto.processed_by_user) : null;
        const authorized_by = dto.authorized_by_user ? await this.userService.findOne(dto.authorized_by_user) : null;

        const { original_transaction_id, shop_id, counter_id, customer_id, processed_by_user, authorized_by_user, ...data } = dto;
        const refund = this.refundRepo.create(data);
        refund.original_transaction = transaction;
        if (shop) refund.shop = shop;
        if (counter) refund.counter = counter;
        if (customer) refund.customer = customer;
        if (processed_by) refund.processed_by = processed_by;
        if (authorized_by) refund.authorized_by = authorized_by;

        return this.refundRepo.save(refund);
    }

    async findAll(): Promise<Refund[]> {
        return this.refundRepo.find({ relations: ['original_transaction', 'shop', 'counter', 'customer', 'processed_by', 'authorized_by', 'items', 'approvals'] });
    }

    async findOne(id: number): Promise<Refund> {
        const refund = await this.refundRepo.findOne({ where: { refund_id: id }, relations: ['original_transaction', 'shop', 'counter', 'customer', 'processed_by', 'authorized_by', 'items', 'approvals'] });
        if (!refund) throw new NotFoundException(`Refund ${id} not found`);
        return refund;
    }
}
