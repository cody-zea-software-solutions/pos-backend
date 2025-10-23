import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GstItemDetail } from './gst-item-details.entity';
import { CreateGstItemDetailDto } from './dto/create-gst-item.dto';
import { UpdateGstItemDetailDto } from './dto/update-gst-item.dto';

@Injectable()
export class GstItemDetailsService {
  constructor(
    @InjectRepository(GstItemDetail)
    private readonly repo: Repository<GstItemDetail>,
  ) {}

  async create(dto: CreateGstItemDetailDto): Promise<GstItemDetail> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async findAll(): Promise<GstItemDetail[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<GstItemDetail> {
    const item = await this.repo.findOne({ where: { gst_item_id: id } });
    if (!item) throw new NotFoundException('GST Item Detail not found');
    return item;
  }

  async update(id: number, dto: UpdateGstItemDetailDto): Promise<GstItemDetail> {
    const existing = await this.findOne(id);
    const updated = { ...existing, ...dto };
    await this.repo.update({ gst_item_id: id }, updated);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete({ gst_item_id: id });
    if (res.affected === 0) throw new NotFoundException('GST Item Detail not found');
  }
}
