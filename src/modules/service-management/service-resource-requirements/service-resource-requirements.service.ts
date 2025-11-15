import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceResourceRequirement } from './service-resource-requirements.entity';
import { CreateServiceResourceRequirementDto } from './dto/create-service-resource-requirements.dto';
import { UpdateServiceResourceRequirementDto } from './dto/update-service-resource-requirements.dto';
import { Service } from '../services/service.entity';
import { ServiceResource } from '../service-resources/service-resources.entity';

@Injectable()
export class ServiceResourcesRequirementsService {
  constructor(
    @InjectRepository(ServiceResourceRequirement)
    private readonly requirementRepo: Repository<ServiceResourceRequirement>,
  ) {}

  //Create a new requirement
  async create(dto: CreateServiceResourceRequirementDto) {
    const requirement = this.requirementRepo.create({
      ...dto,
      // Match your entity PK names exactly (service_id, resource_id)
      service: { service_id: dto.service_id } as Service,
      resource: { resource_id: dto.resource_id } as ServiceResource,
    });

    return await this.requirementRepo.save(requirement);
  }

  //Get all requirements with relations
  async findAll() {
    return await this.requirementRepo.find({
      relations: ['service', 'resource'],
    });
  }

  // Get a single requirement
  async findOne(id: number) {
    const requirement = await this.requirementRepo.findOne({
      where: { requirement_id: id },
      relations: ['service', 'resource'],
    });

    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${id} not found`);
    }

    return requirement;
  }

  //Update a requirement
  async update(id: number, dto: UpdateServiceResourceRequirementDto) {
    const existing = await this.findOne(id);

    Object.assign(existing, {
      ...dto,
      ...(dto.service_id && { service: { service_id: dto.service_id } as Service }),
      ...(dto.resource_id && { resource: { resource_id: dto.resource_id } as ServiceResource }),
    });

    return await this.requirementRepo.save(existing);
  }

  //Delete a requirement
  async remove(id: number) {
    const existing = await this.findOne(id);
    return await this.requirementRepo.remove(existing);
  }
}
