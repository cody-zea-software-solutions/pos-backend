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
    private readonly repository: Repository<CashDrawerTransaction>,
  ) {}

  async create(dto: CreateCashDrawerTransactionDto) {
    const transaction = new CashDrawerTransaction();

    // Relations (based on id fields in related entities)
 transaction.counter = { counter_id: dto.counter_id } as any;
transaction.shift = { shift_id: dto.shift_id } as any;
transaction.performed_by_user = { user_id: dto.performed_by_user } as any;
transaction.authorized_by_user = { user_id: dto.authorized_by_user } as any;


    // Basic fields
    transaction.transaction_type = dto.transaction_type;
    transaction.amount = dto.amount;
    transaction.balance_before = dto.balance_before;
    transaction.balance_after = dto.balance_after;
    transaction.reference_number = dto.reference_number;
    transaction.reason = dto.reason;
    transaction.status = dto.status ?? 'ACTIVE';
    transaction.notes = dto.notes;

    return this.repository.save(transaction);
  }

  async findAll() {
    return this.repository.find({
      relations: ['counter', 'shift', 'performed_by_user', 'authorized_by_user'],
    });
  }

  async findOne(id: number) {
    return this.repository.findOne({
      where: { drawer_transaction_id: id },
      relations: ['counter', 'shift', 'performed_by_user', 'authorized_by_user'],
    });
  }
}
