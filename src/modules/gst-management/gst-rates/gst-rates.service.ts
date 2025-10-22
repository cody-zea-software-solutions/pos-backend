import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GstRate } from './gst-rates.entity';
import { CreateGstRateDto } from './dto/create-gst-rates.dto';
import { UpdateGstRateDto } from './dto/update-gst-rates.dto';

@Injectable()
export class GstRatesService {
  constructor(
    @InjectRepository(GstRate)
    private readonly repo: Repository<GstRate>,
  ) {}

  async create(dto: CreateGstRateDto): Promise<GstRate> {
    const gstRate = this.repo.create(dto);
    return this.repo.save(gstRate);
  }

  async findAll(): Promise<GstRate[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<GstRate> {
    const rate = await this.repo.findOne({ where: { gst_rate_id: id } });
    if (!rate) throw new NotFoundException('GST Rate not found');
    return rate;
  }

  async update(id: number, dto: UpdateGstRateDto): Promise<GstRate> {
    const existing = await this.findOne(id);
    const updated = { ...existing, ...dto };
    await this.repo.update({ gst_rate_id: id }, updated);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete({ gst_rate_id: id });
    if (res.affected === 0) throw new NotFoundException('GST Rate not found');
  }
}
