import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {

     constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
  ) {}

async create(dto: CreateCustomerDto): Promise<Customer> {
    const customer = this.repo.create({
      ...dto,
      birth_date: dto.birth_date ? new Date(dto.birth_date) : null,
      last_scan: dto.last_scan ? new Date(dto.last_scan) : null,
    });
    return this.repo.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.repo.findOne({ where: { customer_id: id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async findByQRCode(qr: string): Promise<Customer | null> {
    return this.repo.findOne({ where: { qr_code: qr } });
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    const toSave = {
      ...customer,
      ...dto,
      birth_date: dto.birth_date ? new Date(dto.birth_date as any) : customer.birth_date,
      last_scan: dto.last_scan ? new Date(dto.last_scan as any) : customer.last_scan,
    };
    await this.repo.update({ customer_id: id }, toSave);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete({ customer_id: id });
    if (res.affected === 0) throw new NotFoundException('Customer not found');
  }

}
