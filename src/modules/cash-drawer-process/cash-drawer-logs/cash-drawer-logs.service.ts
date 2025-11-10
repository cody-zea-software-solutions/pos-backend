import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashDrawerLogs } from './cash-drawer-logs.entity';
import { CreateCashDrawerLogsDto } from './dto/create-cash-drawer-logs.dto';
import { UpdateCashDrawerLogsDto } from './dto/update-cash-drawer-logs.dto';

@Injectable()
export class CashDrawerLogsService {
  constructor(
    @InjectRepository(CashDrawerLogs)
    private readonly logsRepository: Repository<CashDrawerLogs>,
  ) {}

  async create(createDto: CreateCashDrawerLogsDto): Promise<CashDrawerLogs> {
    const log = this.logsRepository.create({
      shift: { shift_id: createDto.shift_id } as any,
      counter: { counter_id: createDto.counter_id } as any,
      action: createDto.action,
      amount: createDto.amount,
      reason: createDto.reason,
      notes: createDto.notes,
      reference_id: createDto.reference_id,
      requires_approval: createDto.requires_approval ?? false,
      performed_by_user: { user_id: createDto.performed_by_user } as any,
      approved_by_user: createDto.approved_by_user ? { user_id: createDto.approved_by_user } as any : null,
    });

    const saved = await this.logsRepository.save(log);

    const reloaded = await this.logsRepository.findOne({
      where: { log_id: saved.log_id },
      relations: ['counter', 'shift', 'performed_by_user', 'approved_by_user'],
    });

    if (!reloaded) {
      throw new NotFoundException('Failed to reload saved cash drawer log');
    }

    return reloaded;
  }

  async findAll(): Promise<CashDrawerLogs[]> {
    return await this.logsRepository.find({
      relations: ['counter', 'shift', 'performed_by_user', 'approved_by_user'],
      order: { action_time: 'DESC' },
    });
  }

  async findOne(id: number): Promise<CashDrawerLogs> {
    const log = await this.logsRepository.findOne({
      where: { log_id: id },
      relations: ['counter', 'shift', 'performed_by_user', 'approved_by_user'],
    });

    if (!log) {
      throw new NotFoundException(`Cash Drawer Log with ID ${id} not found`);
    }

    return log;
  }

  async update(id: number, updateDto: UpdateCashDrawerLogsDto): Promise<CashDrawerLogs> {
    const log = await this.findOne(id);
    Object.assign(log, updateDto);

    // Handle relation updates if necessary (approved_by_user)
    if (updateDto.approved_by_user) {
      log.approved_by_user = { user_id: updateDto.approved_by_user } as any;
    }

    return await this.logsRepository.save(log);
  }

  async remove(id: number): Promise<void> {
    const result = await this.logsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cash Drawer Log with ID ${id} not found`);
    }
  }
}
