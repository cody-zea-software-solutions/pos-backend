import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceResource } from './service-resources.entity';
import { CreateServiceResourceDto } from './dto/create-service-resources.dto';
import { UpdateServiceResourceDto } from './dto/update-service-resources.dto';
import { Shop } from '../../shop/shop.entity';
@Injectable()
export class ServiceResourcesService {
  constructor(
    @InjectRepository(ServiceResource)
    private readonly resourceRepo: Repository<ServiceResource>,
    @InjectRepository(Shop)
    private readonly shopRepo: Repository<Shop>,
  ) {}

  async create(dto: CreateServiceResourceDto): Promise<ServiceResource> {
    const shop = await this.shopRepo.findOne({ where: { shop_id: dto.shop_id } });
    if (!shop) throw new NotFoundException('Shop not found');

    const resource = this.resourceRepo.create({ ...dto, shop });
    return await this.resourceRepo.save(resource);
  }

  async findAll(): Promise<ServiceResource[]> {
    return await this.resourceRepo.find({ relations: ['shop'] });
  }

  async findOne(id: number): Promise<ServiceResource> {
    const resource = await this.resourceRepo.findOne({ where: { resource_id: id }, relations: ['shop'] });
    if (!resource) throw new NotFoundException('Service Resource not found');
    return resource;
  }

  async update(id: number, dto: UpdateServiceResourceDto): Promise<ServiceResource> {
    const resource = await this.findOne(id);

    if (dto.shop_id) {
      const shop = await this.shopRepo.findOne({ where: { shop_id: dto.shop_id } });
      if (!shop) throw new NotFoundException('Shop not found');
      resource.shop = shop;
    }

    Object.assign(resource, dto);
    return await this.resourceRepo.save(resource);
  }

  async remove(id: number): Promise<void> {
    const result = await this.resourceRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Service Resource not found');
  }
}
