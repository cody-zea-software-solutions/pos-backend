import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GstReturn } from './gst-return.entity';
import { CreateGstReturnDto } from './dto/create-gst-return.dto';
import { UpdateGstReturnDto } from './dto/update-gst-return.dto';

@Injectable()
export class GstReturnService {
  constructor(
    @InjectRepository(GstReturn)
    private gstReturnRepository: Repository<GstReturn>,
  ) {}

  async create(createGstReturnDto: CreateGstReturnDto): Promise<GstReturn> {
    const gstReturn = this.gstReturnRepository.create(createGstReturnDto);
    return this.gstReturnRepository.save(gstReturn);
  }

  async findAll(): Promise<GstReturn[]> {
    return this.gstReturnRepository.find();
  }

  async findOne(id: number): Promise<GstReturn> {
    const gstReturn = await this.gstReturnRepository.findOne({ where: { return_id: id } });
    if (!gstReturn) throw new NotFoundException(`GST Return ${id} not found`);
    return gstReturn;
  }

  async update(id: number, dto: UpdateGstReturnDto): Promise<GstReturn> {
    const gstReturn = await this.findOne(id);
    Object.assign(gstReturn, dto);
    return this.gstReturnRepository.save(gstReturn);
  }

  async remove(id: number): Promise<void> {
    const gstReturn = await this.findOne(id);
    await this.gstReturnRepository.remove(gstReturn);
  }
}
