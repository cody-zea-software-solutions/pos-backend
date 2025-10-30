import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import { ShopService } from '../../shop/shop.service';
import { CounterService } from '../../counter/counter.service';
import { CustomerService } from '../../loyalty-management/customer/customer.service';
import { UsersService } from '../../users/users.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { LoyaltyLevelsService } from 'src/modules/loyalty-management/loyalty-levels/loyalty-levels.service';
import { LoyaltyPointsService } from 'src/modules/loyalty-management/loyalty-points/loyalty-points.service';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
        private readonly shopService: ShopService,
        private readonly counterService: CounterService,
        private readonly customerService: CustomerService,
        private readonly userService: UsersService,
        private readonly loyaltyLevelService: LoyaltyLevelsService,
        private readonly loyaltyPointsService: LoyaltyPointsService,
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

        const shop = dto.shop_id ? await this.shopService.findOne(dto.shop_id) : null;
        const counter = dto.counter_id ? await this.counterService.findOne(dto.counter_id) : null;
        const customer = dto.customer_id ? await this.customerService.findOne(dto.customer_id) : null;
        const user = dto.processed_by_user ? await this.userService.findOne(dto.processed_by_user) : null;

        const { shop_id, counter_id, customer_id, processed_by_user, ...data } = dto;

        // compute loyalty points (if customer present)
        let autoCalculatedPoints = 0;
        if (customer) {
            // Resolve customer's loyalty level id (supports eager relation object or id)
            let levelId: number | undefined;
            if (customer.current_level_id && typeof customer.current_level_id === 'object') {
                // eager loaded object
                levelId = (customer.current_level_id as any).level_id;
            } else if (typeof customer.current_level_id === 'number') {
                levelId = customer.current_level_id as number;
            }

            let pointsRate = 0;
            if (levelId) {
                try {
                    const loyaltyLevel = await this.loyaltyLevelService.findOne(levelId);
                    pointsRate = Number(loyaltyLevel?.points_rate ?? 0);
                } catch (err) {
                    // if loyalty level lookup fails, just fallback to 0
                    pointsRate = 0;
                }
            }

            // Ensure subtotal exists
            const subtotal = Number(data.subtotal ?? 0);

            // Calculate points
            autoCalculatedPoints = Math.floor(subtotal * pointsRate);

            // Combine Auto + Manual
            const manualPoints = Number(dto.loyalty_points_earned ?? 0);
            const totalPoints = autoCalculatedPoints + manualPoints;

            // attach to entity data so it gets saved with transaction
            data.loyalty_points_earned = totalPoints;
            data.is_loyalty_applied = totalPoints > 0;
        } else {
            // ensure default fields exist
            data.loyalty_points_earned = 0;
            data.is_loyalty_applied = false;
        }

        // create entity
        const transaction = this.transactionRepo.create(data);

        if (shop) transaction.shop = shop;
        if (counter) transaction.counter = counter;
        if (customer) transaction.customer = customer;
        if (user) transaction.processed_by = user;

        // Save transaction
        const saved = await this.transactionRepo.save(transaction);

        //  record loyalty points if needed
        const pointsEarned = Number(saved.loyalty_points_earned ?? 0);
        const pointsRedeemed = Number(saved.loyalty_points_redeemed ?? 0);

        if (pointsEarned > 0 || pointsRedeemed > 0) {
            const processedByUserId =
                (saved.processed_by && (saved.processed_by as any).user_id) ||
                dto.processed_by_user ||
                undefined;

            await this.loyaltyPointsService.recordFromTransaction({
                transaction: saved,
                points_earned: pointsEarned,
                points_redeemed: pointsRedeemed,
                processed_by_user: processedByUserId,
            });
        }

        // update customer stats (always if customer exists)
        if (saved.customer) {
            await this.customerService.updateAfterTransaction(saved);
        }

        return saved;
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
