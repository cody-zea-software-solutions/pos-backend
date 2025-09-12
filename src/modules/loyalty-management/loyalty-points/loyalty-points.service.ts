import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyPoints } from './loyalty-points.entity';
import { CreateLoyaltyPointsDto } from './dto/create-loyalty-points.dto';
import { UpdateLoyaltyPointsDto } from './dto/update-loyalty-points.dto';
import { Customer } from '../customer/customer.entity';
import { Shop } from '../../shop/shop.entity';
import { Counter } from '../../counter/counter.entity';
import { User } from '../../users/user.entity';

@Injectable()
export class LoyaltyPointsService {
  constructor(
    @InjectRepository(LoyaltyPoints)
    private readonly loyaltyPointsRepo: Repository<LoyaltyPoints>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Shop)
    private readonly shopRepo: Repository<Shop>,
    @InjectRepository(Counter)
    private readonly counterRepo: Repository<Counter>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateLoyaltyPointsDto): Promise<LoyaltyPoints> {
    // FK existence checks — fail fast with 400 if any is wrong
    const [customer, shop, counter, createdBy] = await Promise.all([
      this.customerRepo.findOne({ where: { customer_id: dto.customer_id } }),
      this.shopRepo.findOne({ where: { shop_id: dto.shop_id } }),
      this.counterRepo.findOne({ where: { counter_id: dto.counter_id } }),
      this.userRepo.findOne({ where: { user_id: dto.created_by_user } }),
    ]);

    if (!customer)
      throw new BadRequestException(
        `Invalid customer_id: ${dto.customer_id}`,
      );
    if (!shop) throw new BadRequestException(`Invalid shop_id: ${dto.shop_id}`);
    if (!counter)
      throw new BadRequestException(`Invalid counter_id: ${dto.counter_id}`);
    if (!createdBy)
      throw new BadRequestException(
        `Invalid created_by_user: ${dto.created_by_user}`,
      );

    const entity = this.loyaltyPointsRepo.create({
      // Map only scalar columns
      points_earned: dto.points_earned,
      points_redeemed: dto.points_redeemed ?? 0,
      transaction_type: dto.transaction_type,
      transaction_ref: dto.transaction_ref,
      description: dto.description ?? null,
      expiry_date: dto.expiry_date ? new Date(dto.expiry_date) : null,
      is_active: dto.is_active ?? true,

      // Proper relation assignment using actual PK prop names
      customer: { customer_id: customer.customer_id } as Customer,
      shop: { shop_id: shop.shop_id } as Shop,
      counter: { counter_id: counter.counter_id } as Counter,
      createdBy: { user_id: createdBy.user_id } as User,
    });

    return await this.loyaltyPointsRepo.save(entity);
  }

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

  async update(
    id: number,
    dto: UpdateLoyaltyPointsDto,
  ): Promise<LoyaltyPoints> {
    const row = await this.findOne(id);

    // Update scalar fields only
    if (dto.points_earned !== undefined) row.points_earned = dto.points_earned;
    if (dto.points_redeemed !== undefined)
      row.points_redeemed = dto.points_redeemed;
    if (dto.transaction_type !== undefined)
      row.transaction_type = dto.transaction_type;
    if (dto.transaction_ref !== undefined)
      row.transaction_ref = dto.transaction_ref;
    if (dto.description !== undefined)
      row.description = dto.description ?? null;
    if (dto.expiry_date !== undefined)
      row.expiry_date = dto.expiry_date ? new Date(dto.expiry_date) : null;
    if (dto.is_active !== undefined) row.is_active = dto.is_active;

    
    
    if (dto.customer_id !== undefined) {
      const customer = await this.customerRepo.findOne({ where: { customer_id: dto.customer_id }});
      if (!customer) throw new BadRequestException(`Invalid customer_id: ${dto.customer_id}`);
      row.customer = { customer_id: customer.customer_id } as Customer;
    }
    if (dto.shop_id !== undefined) {
      const shop = await this.shopRepo.findOne({ where: { shop_id: dto.shop_id }});
      if (!shop) throw new BadRequestException(`Invalid shop_id: ${dto.shop_id}`);
      row.shop = { shop_id: shop.shop_id } as Shop;
    }
    if (dto.counter_id !== undefined) {
      const counter = await this.counterRepo.findOne({ where: { counter_id: dto.counter_id }});
      if (!counter) throw new BadRequestException(`Invalid counter_id: ${dto.counter_id}`);
      row.counter = { counter_id: counter.counter_id } as Counter;
    }
    if (dto.created_by_user !== undefined) {
      const user = await this.userRepo.findOne({ where: { user_id: dto.created_by_user }});
      if (!user) throw new BadRequestException(`Invalid created_by_user: ${dto.created_by_user}`);
      row.createdBy = { user_id: user.user_id } as User;
    }
    

    return this.loyaltyPointsRepo.save(row);
  }

  async remove(id: number): Promise<void> {
    const row = await this.findOne(id);
    await this.loyaltyPointsRepo.remove(row);
  }
}
