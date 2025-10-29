import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { LoyaltyLevel } from '../loyalty-levels/loyalty-levels.entity';
import { Shop } from '../../shop/shop.entity';
import { Counter } from '../../counter/counter.entity';

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
  ) {}

  // ------------------- CREATE -------------------
  async create(dto: CreateCustomerDto): Promise<Customer> {
    const existingQr = await this.customerRepository.findOne({ where: { qr_code: dto.qr_code } });
    if (existingQr) throw new ConflictException('QR Code already exists');

    if (dto.email) {
      const existingEmail = await this.customerRepository.findOne({ where: { email: dto.email } });
      if (existingEmail) throw new ConflictException('Email already registered');
    }

    const shop = await this.shopRepository.findOne({ where: { shop_id: dto.preferred_shop } });
    if (!shop) throw new NotFoundException(`Shop ${dto.preferred_shop} not found`);

    let counter: Counter | undefined;
    if (dto.preferred_counter) {
      const foundCounter = await this.counterRepository.findOne({ where: { counter_id: Number(dto.preferred_counter) } });
      counter = foundCounter ?? undefined;
      if (!counter) throw new NotFoundException(`Counter ${dto.preferred_counter} not found`);
    }

    let loyaltyLevel: LoyaltyLevel | undefined;
    if (dto.current_level_id) {
      const foundLevel = await this.loyaltyLevelRepository.findOne({ where: { level_id: dto.current_level_id } });
      loyaltyLevel = foundLevel ?? undefined;
      if (!loyaltyLevel) throw new NotFoundException(`Loyalty level ${dto.current_level_id} not found`);
    }

    const customer: Customer = this.customerRepository.create({
      ...dto,
      preferred_shop: shop,
      preferred_counter: counter, 
      current_level_id: loyaltyLevel,
    });

    return this.customerRepository.save(customer);
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
}
