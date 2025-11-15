import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from './service-categories.entity';
import { CreateServiceCategoryDto } from './dto/create-service-categories.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-categories.dto';

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly categoryRepo: Repository<ServiceCategory>,
  ) {}

 
  // CREATE

  async create(dto: CreateServiceCategoryDto): Promise<ServiceCategory> {
    // Duplicate category_code check
    const existing = await this.categoryRepo.findOne({
      where: { category_code: dto.category_code },
    });
    if (existing) {
      throw new ConflictException(
        `Category code '${dto.category_code}' already exists`,
      );
    }

    // Validate parent if provided
    const parent: ServiceCategory | null = dto.parent_service_category_id
      ? await this.findOne(dto.parent_service_category_id)
      : null;

    const { parent_service_category_id, ...data } = dto;
    const category = this.categoryRepo.create(data);

    if (parent) {
      category.parent = parent;
    }

    return this.categoryRepo.save(category);
  }

  
  // FIND ALL
 
  async findAll(): Promise<ServiceCategory[]> {
    return this.categoryRepo.find({
      relations: ['parent', 'children'],
      order: { sort_order: 'ASC' },
    });
  }

 
  // FIND ONE
 
  async findOne(id: number): Promise<ServiceCategory> {
    const category = await this.categoryRepo.findOne({
      where: { service_category_id: id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Service Category ${id} not found`);
    }

    return category;
  }

  
  // UPDATE
  
  async update(
    id: number,
    dto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    const category = await this.findOne(id);

    // If category_code is updating → check duplicates
    if (dto.category_code && dto.category_code !== category.category_code) {
      const existing = await this.categoryRepo.findOne({
        where: { category_code: dto.category_code },
      });
      if (existing) {
        throw new ConflictException(
          `Category code '${dto.category_code}' already exists`,
        );
      }
    }

    // Update parent category
    if (dto.parent_service_category_id) {
      const parent = await this.findOne(dto.parent_service_category_id);
      category.parent = parent;
    }

    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  
  // DELETE
  // -------------------
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
  }
}
