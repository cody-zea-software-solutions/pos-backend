import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Repository } from 'typeorm';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from '../../users/users.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>,
        private readonly transactionService: TransactionsService,
        private readonly userService: UsersService
    ) { }

    async create(dto: CreatePaymentDto): Promise<Payment> {
        const transaction = await this.transactionService.findOne(dto.transaction_id);
        if (!transaction) throw new NotFoundException(`Transaction ${dto.transaction_id} not found`);

        const user = dto.processed_by_user
            ? await this.userService.findOne(dto.processed_by_user)
            : null;

        const { transaction_id, processed_by_user, ...data } = dto;

        const payment = this.paymentRepo.create(data);
        payment.transaction = transaction;
        if (user) payment.processed_by = user;

        return this.paymentRepo.save(payment);
    }

    async findAll(): Promise<Payment[]> {
        return this.paymentRepo.find({ relations: ['transaction', 'processed_by'] });
    }

    async findOne(id: number): Promise<Payment> {
        const payment = await this.paymentRepo.findOne({
            where: { payment_id: id },
            relations: ['transaction', 'processed_by'],
        });
        if (!payment) throw new NotFoundException(`Payment ${id} not found`);
        return payment;
    }
}
