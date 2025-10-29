import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashDrawerTransaction } from './cash-drawer-transaction.entity';
import { CreateCashDrawerTransactionDto } from './dto/create-cash-drawer-transaction.dto';
import { UpdateCashDrawerTransactionDto } from './dto/update-cash-drawer-transaction.dto';

@Injectable()
export class CashDrawerTransactionService {
  constructor(
    @InjectRepository(CashDrawerTransaction)
    private repository: Repository<CashDrawerTransaction>,
  ) {}

  create(dto: CreateCashDrawerTransactionDto) {
    const transaction = this.repository.create(dto);
    return this.repository.save(transaction);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOneBy({ drawer_transaction_id: id });
  }
/*
  update(id: number, dto: UpdateCashDrawerTransactionDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }*/
 
}
