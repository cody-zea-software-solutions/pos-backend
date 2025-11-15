import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceTransaction } from './service-transactions.entity';
import { CreateServiceTransactionDto } from './dto/create-service-transactions.dto';
import { UpdateServiceTransactionDto } from './dto/update-service-transactions.dto';
import { Service } from '../services/service.entity';

@Injectable()
export class ServiceTransactionService {
  constructor(
    @InjectRepository(ServiceTransaction)
    private readonly serviceTransactionRepo: Repository<ServiceTransaction>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  // Create a new transaction
  async create(dto: CreateServiceTransactionDto): Promise<ServiceTransaction> {
    // Find the Service (unidirectional FK)
    const service = await this.serviceRepo.findOne({
      where: { service_id: dto.service_id }, // Use actual column name
    });
    if (!service) throw new NotFoundException('Service not found');

    // Create transaction entity
    const transaction = this.serviceTransactionRepo.create({ ...dto, service });
    return this.serviceTransactionRepo.save(transaction);
  }

  // Get all transactions
  findAll(): Promise<ServiceTransaction[]> {
    return this.serviceTransactionRepo.find({
      relations: ['service'], // eager load the Service relation
    });
  }

  // Get a single transaction
  async findOne(id: number): Promise<ServiceTransaction> {
    const transaction = await this.serviceTransactionRepo.findOne({
      where: { service_transaction_id: id },
      relations: ['service'],
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  // Update a transaction
  async update(id: number, dto: UpdateServiceTransactionDto): Promise<ServiceTransaction> {
    const transaction = await this.findOne(id);

    if (dto.service_id) {
      const service = await this.serviceRepo.findOne({
        where: { service_id: dto.service_id },
      });
      if (!service) throw new NotFoundException('Service not found');
      transaction.service = service;
    }

    // Merge the rest of the DTO into the transaction
    Object.assign(transaction, dto);

    return this.serviceTransactionRepo.save(transaction);
  }

  // Delete a transaction
  async remove(id: number): Promise<void> {
    const transaction = await this.findOne(id);
    await this.serviceTransactionRepo.remove(transaction);
  }
}
