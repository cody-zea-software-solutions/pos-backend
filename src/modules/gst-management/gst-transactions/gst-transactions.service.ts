import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GstTransaction } from './gst-transactions.entity';
import { CreateGstTransactionDto } from './dto/create-gst-transaction.dto';
import { UpdateGstTransactionDto } from './dto/update-gst-transaction.dto';

@Injectable()
export class GstTransactionsService {
  constructor(
    @InjectRepository(GstTransaction)
    private readonly repo: Repository<GstTransaction>,
  ) {}

  async create(dto: CreateGstTransactionDto): Promise<GstTransaction> {
    const transaction = this.repo.create(dto);
    return this.repo.save(transaction);
  }

  async findAll(): Promise<GstTransaction[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<GstTransaction> {
    const record = await this.repo.findOne({ where: { gst_transaction_id: id } });
    if (!record) throw new NotFoundException('GST Transaction not found');
    return record;
  }

  async update(id: number, dto: UpdateGstTransactionDto): Promise<GstTransaction> {
    const existing = await this.findOne(id);
    const updated = { ...existing, ...dto };
    await this.repo.update({ gst_transaction_id: id }, updated);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete({ gst_transaction_id: id });
    if (res.affected === 0) throw new NotFoundException('GST Transaction not found');
  }
}
