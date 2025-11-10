import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { LoyaltyLevel } from '../loyalty-levels/loyalty-levels.entity';
import { Shop } from '../../shop/shop.entity';
import { Counter } from '../../counter/counter.entity';
import { Transaction } from '../../pos-transactions/transactions/transaction.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(LoyaltyLevel)
    private readonly loyaltyLevelRepository: Repository<LoyaltyLevel>,

    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,

    @InjectRepository(Counter)
    private readonly counterRepository: Repository<Counter>,
  ) { }

  // ------------------- CREATE -------------------
  async create(dto: CreateCustomerDto): Promise<Customer> {
    // Check for duplicate QR
    const existingQr = await this.customerRepository.findOne({
      where: { qr_code: dto.qr_code },
    });
    if (existingQr) throw new ConflictException('QR Code already exists');

    // Check duplicate email
    if (dto.email) {
      const existingEmail = await this.customerRepository.findOne({
        where: { email: dto.email },
      });
      if (existingEmail)
        throw new ConflictException('Email already registered');
    }

    // Validate shop
    const shop = await this.shopRepository.findOne({
      where: { shop_id: dto.preferred_shop },
    });
    if (!shop)
      throw new NotFoundException(`Shop ${dto.preferred_shop} not found`);

    // Validate counter
    let counter: Counter | undefined;
    if (dto.preferred_counter) {
      const foundCounter = await this.counterRepository.findOne({
        where: { counter_id: Number(dto.preferred_counter) },
      });
      if (!foundCounter)
        throw new NotFoundException(
          `Counter ${dto.preferred_counter} not found`,
        );
      counter = foundCounter;
    }

    // Determine loyalty level
    let loyaltyLevel: LoyaltyLevel | undefined;

    if (dto.current_level_id) {
      // If a specific level is provided, verify it
      const foundLevel = await this.loyaltyLevelRepository.findOne({
        where: { level_id: dto.current_level_id },
      });
      if (!foundLevel)
        throw new NotFoundException(
          `Loyalty level ${dto.current_level_id} not found`,
        );
      loyaltyLevel = foundLevel;
    } else {
      // If no level provided, get the lowest one by min_points_required
      const lowestLevel = await this.loyaltyLevelRepository.find({
        order: { min_points_required: 'ASC' },
        take: 1,
      });

      if (!lowestLevel || lowestLevel.length === 0) {
        throw new BadRequestException(
          'Cannot create customer because no loyalty levels are defined. Please create at least one loyalty level first.',
        );
      }

      loyaltyLevel = lowestLevel[0];
    }

    // Create the customer entity
    const customer: Customer = this.customerRepository.create({
      ...dto,
      preferred_shop: shop,
      preferred_counter: counter,
      current_level_id: loyaltyLevel,
    });

    // Save and return
    return await this.customerRepository.save(customer);
  }

  // ------------------- READ -------------------
  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({
      relations: ['preferred_shop', 'preferred_counter', 'current_level_id'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { customer_id: id },
      relations: ['preferred_shop', 'preferred_counter', 'current_level_id'],
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async findByQRCode(qr_code: string): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { qr_code },
      relations: ['preferred_shop', 'current_level_id'],
    });
  }

  // ------------------- UPDATE -------------------
  async update(id: number, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    if (dto.current_level_id) {
      const loyaltyLevel = await this.loyaltyLevelRepository.findOne({ where: { level_id: dto.current_level_id } });
      if (!loyaltyLevel) throw new NotFoundException(`Loyalty level ${dto.current_level_id} not found`);
      customer.current_level_id = loyaltyLevel;
    }

    if (dto.preferred_shop) {
      const shop = await this.shopRepository.findOne({ where: { shop_id: dto.preferred_shop } });
      if (!shop) throw new NotFoundException(`Shop ${dto.preferred_shop} not found`);
      customer.preferred_shop = shop;
    }

    if (dto.preferred_counter) {
      const counter = await this.counterRepository.findOne({ where: { counter_id: Number(dto.preferred_counter) } });
      if (!counter) throw new NotFoundException(`Counter ${dto.preferred_counter} not found`);
      customer.preferred_counter = counter;
    }

    Object.assign(customer, dto);
    return this.customerRepository.save(customer);
  }

  // ------------------- DELETE -------------------
  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }

  // ------------------- UPDATE AFTER TRANSACTION -------------------
  async updateAfterTransaction(transaction: Transaction): Promise<void> {
    if (!transaction.customer) return; // skip if no customer linked

    // Ensure we have full customer object
    const customer =
      typeof transaction.customer === 'object'
        ? transaction.customer
        : await this.findOne(transaction.customer as any);

    const subtotal = Number(transaction.subtotal ?? 0);
    const earnedPoints = Number(transaction.loyalty_points_earned ?? 0);
    const redeemedPoints = Number(transaction.loyalty_points_redeemed ?? 0);

    // Update totals
    customer.total_spent = Number(customer.total_spent ?? 0) + subtotal;
    customer.total_visits = Number(customer.total_visits ?? 0) + 1;
    customer.total_points = Number(customer.total_points ?? 0) + earnedPoints;
    customer.available_points =
      Number(customer.available_points ?? 0) + earnedPoints - redeemedPoints;

    // Prevent available_points from going negative
    if (customer.available_points < 0) customer.available_points = 0;

    // Check and update loyalty level
    const allLevels = await this.loyaltyLevelRepository.find({
      order: { min_points_required: 'ASC' },
    });

    if (allLevels && allLevels.length > 0) {
      // Find the highest matching level
      const newLevel = allLevels.find(
        (lvl) =>
          customer.total_points >= lvl.min_points_required &&
          customer.total_points <= lvl.max_points_limit,
      );

      if (newLevel) {
        // Only update if it’s a new level
        const currentLevelId =
          typeof customer.current_level_id === 'object'
            ? (customer.current_level_id as any).level_id
            : customer.current_level_id;

        if (currentLevelId !== newLevel.level_id) {
          customer.current_level_id = newLevel;
        }
      }
    }

    // Update last scan timestamp
    customer.last_scan = new Date();

    // Save updates
    await this.customerRepository.save(customer);
  }

}
