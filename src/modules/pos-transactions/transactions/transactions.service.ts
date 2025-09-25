import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import { ShopService } from 'src/modules/shop/shop.service';
import { CounterService } from 'src/modules/counter/counter.service';
import { CustomerService } from 'src/modules/loyalty-management/customer/customer.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
        private readonly shopService: ShopService,
        private readonly counterService: CounterService,
        private readonly customerService: CustomerService,
        private readonly userService: UsersService,
    ) { }

    async create(dto: CreateTransactionDto): Promise<Transaction> {
        const exists = await this.transactionRepo.findOne({
            where: { transaction_number: dto.transaction_number },
        });
        if (exists) {
            throw new ConflictException(
                `Transaction number '${dto.transaction_number}' already exists`,
            );
        }

        const shop = dto.shop_id
            ? await this.shopService.findOne(dto.shop_id)
            : null;

        const counter = dto.counter_id
            ? await this.counterService.findOne(dto.counter_id)
            : null;

        const customer = dto.customer_id
            ? await this.customerService.findOne(dto.customer_id)
            : null;

        const user = dto.processed_by_user
            ? await this.userService.findOne(dto.processed_by_user)
            : null;

        const { shop_id, counter_id, customer_id, processed_by_user, ...data } = dto;

        const transaction = this.transactionRepo.create(data);
        if (shop) transaction.shop = shop;
        if (counter) transaction.counter = counter;
        if (customer) transaction.customer = customer;
        if (user) transaction.processed_by = user;

        return this.transactionRepo.save(transaction);
    }

    async findAll(): Promise<Transaction[]> {
        return this.transactionRepo.find({
            relations: ['shop', 'counter', 'customer', 'processed_by'],
        });
    }

    async findOne(id: number): Promise<Transaction> {
        const transaction = await this.transactionRepo.findOne({
            where: { transaction_id: id },
            relations: ['shop', 'counter', 'customer', 'processed_by'],
        });
        if (!transaction) {
            throw new NotFoundException(`Transaction ${id} not found`);
        }
        return transaction;
    }

    async findByReceiptNumber(receiptNumber: string): Promise<Transaction> {
        const trx = await this.transactionRepo.findOne({
            where: { receipt_number: receiptNumber },
            relations: ['shop', 'counter', 'customer', 'processed_by'],
        });
        if (!trx) {
            throw new NotFoundException(
                `Transaction with receipt '${receiptNumber}' not found`,
            );
        }
        return trx;
    }
}
