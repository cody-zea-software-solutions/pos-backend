import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyPoints } from './loyalty-points.entity';
import { Transaction } from 'src/modules/pos-transactions/transactions/transaction.entity';
import { CustomerService } from '../customer/customer.service';
import { ShopService } from 'src/modules/shop/shop.service';
import { CounterService } from 'src/modules/counter/counter.service';
import { UsersService } from 'src/modules/users/users.service';

type RecordFromTransactionInput = {
  transaction: Transaction;
  points_earned?: number;
  points_redeemed?: number;
  processed_by_user?: number | undefined;
  description?: string | null;
  expiry_date?: Date | null;
};

@Injectable()
export class LoyaltyPointsService {
  constructor(
    @InjectRepository(LoyaltyPoints)
    private readonly loyaltyPointsRepo: Repository<LoyaltyPoints>,
    private readonly customerService: CustomerService,
    private readonly shopService: ShopService,
    private readonly counterService: CounterService,
    private readonly usersService: UsersService,
  ) { }

  async findAll(): Promise<LoyaltyPoints[]> {
    return this.loyaltyPointsRepo.find();
  }

  async findOne(id: number): Promise<LoyaltyPoints> {
    const row = await this.loyaltyPointsRepo.findOne({
      where: { point_id: id },
    });
    if (!row)
      throw new NotFoundException(`Loyalty points record ${id} not found`);
    return row;
  }

  async remove(id: number): Promise<void> {
    const row = await this.findOne(id);
    await this.loyaltyPointsRepo.remove(row);
  }

  //Record loyalty points based on a saved Transaction.
  async recordFromTransaction(input: RecordFromTransactionInput): Promise<LoyaltyPoints> {
    const { transaction, points_earned = 0, points_redeemed = 0, processed_by_user, description, expiry_date } = input;

    const customer = transaction.customer
      ? (typeof transaction.customer === 'object' ? transaction.customer : await this.customerService.findOne(transaction.customer as any))
      : null;
    if (!customer) {
      throw new NotFoundException('Transaction has no customer to record loyalty points for');
    }

    const shop = transaction.shop
      ? (typeof transaction.shop === 'object' ? transaction.shop : await this.shopService.findOne((transaction.shop as any).shop_id))
      : null;
    const counter = transaction.counter
      ? (typeof transaction.counter === 'object' ? transaction.counter : await this.counterService.findOne((transaction.counter as any).counter_id))
      : null;

    const createdBy = processed_by_user
      ? await this.usersService.findOne(processed_by_user)
      : (transaction.processed_by || null);

    // Create loyalty points entry
    const lp = this.loyaltyPointsRepo.create({
      points_earned,
      points_redeemed,
      transaction_type: transaction.transaction_type ?? 'SALE',
      transaction_ref: transaction.transaction_number,
      transaction_date: transaction.transaction_date ?? new Date(),
      description: description ?? null,
      expiry_date: expiry_date ?? null,
      is_active: true,
    });

    // Assign relations
    lp.customer = customer;
    lp.shop = shop;
    lp.counter = counter;
    lp.createdBy = createdBy;

    // Save
    const savedLp = await this.loyaltyPointsRepo.save(lp);

    return savedLp;
  }
}
