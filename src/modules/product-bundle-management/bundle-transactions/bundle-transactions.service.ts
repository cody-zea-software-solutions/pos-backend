import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BundleTransaction } from './bundle-transactions.entity';
import { CreateBundleTransactionDto } from './dto/create-bundle-transaction.dto';
import { UpdateBundleTransactionDto } from './dto/update-budle-transaction.dto';
import { ProductBundle } from '../product-bundles/product-bundle.entity';

@Injectable()
export class BundleTransactionService {
  constructor(
    @InjectRepository(BundleTransaction)
    private readonly transactionRepo: Repository<BundleTransaction>,

    @InjectRepository(ProductBundle)
    private readonly bundleRepo: Repository<ProductBundle>,
  ) {}
//create
  async create(dto: CreateBundleTransactionDto): Promise<BundleTransaction> {
    const bundle = await this.bundleRepo.findOne({
      where: { bundle_id: dto.bundle_id },
    });

    if (!bundle) throw new NotFoundException('Bundle not found');

    const transaction = this.transactionRepo.create({
      ...dto,
      bundle: bundle,
    });

    return this.transactionRepo.save(transaction);
  }
//Find all
  findAll(): Promise<BundleTransaction[]> {
    return this.transactionRepo.find({
      relations: ['bundle'],
      order: { bundle_transaction_id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<BundleTransaction> {
    const transaction = await this.transactionRepo.findOne({
      where: { bundle_transaction_id: id },
      relations: ['bundle'],
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    return transaction;
  }
//update
  async update(id: number, dto: UpdateBundleTransactionDto) {
    const transaction = await this.findOne(id);

    if (dto.bundle_id) {
      const bundle = await this.bundleRepo.findOne({
        where: { bundle_id: dto.bundle_id },
      });
      if (!bundle) throw new NotFoundException('Bundle not found');

      transaction.bundle = bundle;
    }

    Object.assign(transaction, dto);

    return this.transactionRepo.save(transaction);
  }
//delete
  async remove(id: number) {
    const transaction = await this.findOne(id);
    return this.transactionRepo.remove(transaction);
  }
}
