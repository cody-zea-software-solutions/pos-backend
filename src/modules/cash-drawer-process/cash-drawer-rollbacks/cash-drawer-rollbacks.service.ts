import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashDrawerRollback } from './cash-drawer-rollbacks.entity';
import { CreateCashDrawerRollbackDto } from './dto/create-cash-drawer-rollbacks.dto';
import { UpdateCashDrawerRollbackDto } from './dto/update-cash-drawer-rollbacks.dto';

@Injectable()
export class CashDrawerRollbacksService {
  constructor(
    @InjectRepository(CashDrawerRollback)
    private readonly rollbackRepository: Repository<CashDrawerRollback>,
  ) {}

  async create(dto: CreateCashDrawerRollbackDto): Promise<CashDrawerRollback> {
    const rollback = this.rollbackRepository.create(dto);
    return this.rollbackRepository.save(rollback);
  }

  async findAll(): Promise<CashDrawerRollback[]> {
    return this.rollbackRepository.find();
  }

  async findOne(id: number): Promise<CashDrawerRollback> {
    const rollback = await this.rollbackRepository.findOne({ where: { rollback_id: id } });
    if (!rollback) throw new NotFoundException('Rollback not found');
    return rollback;
  }

  /*async update(id: number, dto: UpdateCashDrawerRollbackDto): Promise<CashDrawerRollback> {
    const rollback = await this.findOne(id);
    Object.assign(rollback, dto);
    return this.rollbackRepository.save(rollback);
  }

  async remove(id: number): Promise<void> {
    const rollback = await this.findOne(id);
    await this.rollbackRepository.remove(rollback);
  }*/
}
