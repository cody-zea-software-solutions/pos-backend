import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CashDrawerRollback } from './cash-drawer-rollbacks.entity';
import { CreateCashDrawerRollbackDto } from './dto/create-cash-drawer-rollbacks.dto';
import { UpdateCashDrawerRollbackDto } from './dto/update-cash-drawer-rollbacks.dto';

@Injectable()
export class CashDrawerRollbacksService {
  constructor(
    @InjectRepository(CashDrawerRollback)
    private readonly rollbackRepository: Repository<CashDrawerRollback>,
  ) {}

 async create(createDto: CreateCashDrawerRollbackDto): Promise<CashDrawerRollback> {
  // Map numeric IDs to proper relation objects
  const rollback = this.rollbackRepository.create({
    rollback_amount: createDto.rollback_amount,
    balance_before_rollback: createDto.balance_before_rollback,
    balance_after_rollback: createDto.balance_after_rollback,
    rollback_reason: createDto.rollback_reason,
    rollback_time: new Date(createDto.rollback_time),
    reference_transaction: createDto.reference_transaction,
    is_approved: createDto.is_approved ?? false,
    approval_notes: createDto.approval_notes,
    counter: { counter_id: createDto.counter_id } as any,
    shift: { shift_id: createDto.shift_id } as any,
    performed_by_user: { user_id: createDto.performed_by_user } as any,
    authorized_by_user: { user_id: createDto.authorized_by_user } as any,
  });

  const saved = await this.rollbackRepository.save(rollback);

const reloaded = await this.rollbackRepository.findOne({
  where: { rollback_id: saved.rollback_id },
  relations: ['counter', 'shift', 'performed_by_user', 'authorized_by_user'],
});

if (!reloaded) {
  throw new NotFoundException('Failed to reload saved rollback record');
}

return reloaded;
}

  // Get all rollback records
  async findAll(): Promise<CashDrawerRollback[]> {
    return await this.rollbackRepository.find({
      relations: ['counter', 'shift', 'performed_by_user', 'authorized_by_user'],
      order: { rollback_time: 'DESC' },
    });
  }

  // Get a specific rollback record by ID
  async findOne(id: number): Promise<CashDrawerRollback> {
    const rollback = await this.rollbackRepository.findOne({
      where: { rollback_id: id },
      relations: ['counter', 'shift', 'performed_by_user', 'authorized_by_user'],
    });

    if (!rollback) {
      throw new NotFoundException(`Cash Drawer Rollback with ID ${id} not found`);
    }

    return rollback;
  }

  // Update rollback record
  async update(id: number, updateDto: UpdateCashDrawerRollbackDto): Promise<CashDrawerRollback> {
    const rollback = await this.findOne(id);
    Object.assign(rollback, updateDto);
    return await this.rollbackRepository.save(rollback);
  }

  // Delete a rollback record
  async remove(id: number): Promise<void> {
    const result = await this.rollbackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cash Drawer Rollback with ID ${id} not found`);
    }
  }
}
