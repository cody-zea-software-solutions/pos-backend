import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { ILike, Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepo: Repository<Service>,
    ) { }

    async create(dto: CreateServiceDto, file?: Express.Multer.File): Promise<Service> {
        const exists = await this.serviceRepo.findOne({
            where: { service_code: dto.service_code },
        });
        if (exists) {
            throw new ConflictException(
                `Service code '${dto.service_code}' already exists`,
            );
        }

        const service = this.serviceRepo.create(dto);

        if (file) {
            service.image_url = `/uploads/services/${file.filename}`;
        }

        return this.serviceRepo.save(service);
    }

    async findAll(): Promise<Service[]> {
        return this.serviceRepo.find();
    }

    async findOne(id: number): Promise<Service> {
        const service = await this.serviceRepo.findOne({
            where: { service_id: id },
        });
        if (!service) throw new NotFoundException(`Service ${id} not found`);
        return service;
    }

    async update(id: number, dto: UpdateServiceDto, file?: Express.Multer.File): Promise<Service> {
        const service = await this.findOne(id);

        if (dto.service_code && dto.service_code !== service.service_code) {
            const exists = await this.serviceRepo.findOne({
                where: { service_code: dto.service_code },
            });
            if (exists) {
                throw new ConflictException(
                    `Service code '${dto.service_code}' already exists`,
                );
            }
        }

        Object.assign(service, dto);

        if (file) {
            service.image_url = `/uploads/services/${file.filename}`;
        }

        return this.serviceRepo.save(service);
    }

    async remove(id: number): Promise<void> {
        const service = await this.findOne(id);
        await this.serviceRepo.remove(service);
    }

    async findByName(name: string): Promise<Service[]> {
        return this.serviceRepo.find({
            where: { service_name: ILike(`%${name}%`) },
        });
    }
}
