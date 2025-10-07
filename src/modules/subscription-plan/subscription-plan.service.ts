import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';
import { Repository } from 'typeorm';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { Business } from '../business/business.entity';
import { Shop } from '../shop/shop.entity';
import { User } from '../users/user.entity';
import { Product } from '../product-management/product/product.entity';

@Injectable()
export class SubscriptionPlanService {
    constructor(
        @InjectRepository(SubscriptionPlan)
        private readonly planRepo: Repository<SubscriptionPlan>,

        @InjectRepository(Shop)
        private readonly shopRepo: Repository<Shop>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) { }

    async create(dto: CreateSubscriptionPlanDto): Promise<SubscriptionPlan> {

        const exists = await this.planRepo.findOne({
            where: { plan_code: dto.plan_code },
        });

        if (exists) {
            throw new ConflictException(
                `Plan code '${dto.plan_code}' already exists`,
            );
        }

        // Ensure only one active plan at a time
        if (dto.is_active) {
            const activePlan = await this.planRepo.findOne({
                where: { is_active: true },
            });
            if (activePlan) {
                throw new BadRequestException(
                    `Only one active subscription plan is allowed. Please deactivate the current active plan ('${activePlan.plan_name}') first.`,
                );
            }
        }

        const plan = this.planRepo.create(dto);
        return this.planRepo.save(plan);
    }

    async findAll(): Promise<SubscriptionPlan[]> {
        return this.planRepo.find();
    }

    async findOne(id: number): Promise<SubscriptionPlan> {
        const plan = await this.planRepo.findOne({ where: { plan_id: id } });
        if (!plan) throw new NotFoundException(`Subscription Plan ${id} not found`);
        return plan;
    }

    async update(id: number, dto: UpdateSubscriptionPlanDto): Promise<SubscriptionPlan> {
        const plan = await this.findOne(id);

        if (!plan) {
            throw new NotFoundException(`Subscription plan #${id} not found.`);
        }

        // Prevent multiple active plans
        if (dto.is_active) {
            const anotherActivePlan = await this.planRepo.findOne({
                where: { is_active: true },
            });

            // If there’s another active plan with a different ID → reject
            if (anotherActivePlan && anotherActivePlan.plan_id !== id) {
                throw new BadRequestException(
                    `Another active subscription plan ('${anotherActivePlan.plan_name}') already exists. Please deactivate it first.`,
                );
            }
        }

        Object.assign(plan, dto);
        return this.planRepo.save(plan);
    }

    async remove(id: number): Promise<void> {
        const plan = await this.findOne(id);
        await this.planRepo.remove(plan);
    }

    // Fetches the single active subscription plan 
    async getActivePlan(): Promise<SubscriptionPlan> {
        const plan = await this.planRepo.findOne({ where: { is_active: true } });
        if (!plan) throw new NotFoundException('No active subscription plan found.');
        return plan;
    }

    // Validates system limits globally for the single active plan
    async validateLimit(type: 'shop' | 'user' | 'product') {
        const plan = await this.getActivePlan();

        switch (type) {
            case 'shop': {
                const count = await this.shopRepo.count();
                if (count >= plan.max_branches) {
                    throw new ForbiddenException(
                        `Maximum branches (${plan.max_branches}) reached for this subscription plan.`,
                    );
                }
                break;
            }

            case 'user': {
                const count = await this.userRepo.count();
                if (count >= plan.max_users) {
                    throw new ForbiddenException(
                        `Maximum users (${plan.max_users}) reached for this subscription plan.`,
                    );
                }
                break;
            }

            case 'product': {
                const count = await this.productRepo.count();
                if (count >= plan.max_products) {
                    throw new ForbiddenException(
                        `Maximum products (${plan.max_products}) reached for this subscription plan.`,
                    );
                }
                break;
            }
        }
    }
}
