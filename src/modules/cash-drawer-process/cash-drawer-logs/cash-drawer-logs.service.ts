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
    private cashDrawerLogsRepository: Repository<CashDrawerLogs>,
  ) {}

  async create(dto: CreateCashDrawerLogsDto): Promise<CashDrawerLogs> {
    const newLog = this.cashDrawerLogsRepository.create(dto);
    return this.cashDrawerLogsRepository.save(newLog);
  }

  async findAll(): Promise<CashDrawerLogs[]> {
    return this.cashDrawerLogsRepository.find();
  }

  async findOne(id: number): Promise<CashDrawerLogs> {
    const log = await this.cashDrawerLogsRepository.findOne({ where: { log_id: id } });
    if (!log) throw new NotFoundException(`Log ID ${id} not found`);
    return log;
  }

  async update(id: number, dto: UpdateCashDrawerLogsDto): Promise<CashDrawerLogs> {
    const log = await this.findOne(id);
    Object.assign(log, dto);
    return this.cashDrawerLogsRepository.save(log);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cashDrawerLogsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Log ID ${id} not found`);
    }
  }
}
