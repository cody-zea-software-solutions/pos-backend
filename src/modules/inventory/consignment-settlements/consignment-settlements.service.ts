import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConsignmentSettlement } from './consignment-settlement.entity';
import { Repository } from 'typeorm';
import { ConsignorService } from '../consignor/consignor.service';
import { ShopService } from 'src/modules/shop/shop.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreateConsignmentSettlementDto } from './dto/create-consignment-settlement.dto';
import { UpdateConsignmentSettlementDto } from './dto/update-consignment-settlement.dto';

@Injectable()
export class ConsignmentSettlementsService {
    constructor(
        @InjectRepository(ConsignmentSettlement)
        private readonly settlementRepo: Repository<ConsignmentSettlement>,
        private readonly consignorsService: ConsignorService,
        private readonly shopsService: ShopService,
        private readonly usersService: UsersService,
    ) { }

    /**
     * Create a new settlement record
     */
    async create(
        dto: CreateConsignmentSettlementDto,
    ): Promise<ConsignmentSettlement> {
        const consignor = await this.consignorsService.findOne(dto.consignor_id);
        if (!consignor) throw new BadRequestException('Invalid consignor');

        const shop = await this.shopsService.findOne(dto.shop_id);
        if (!shop) throw new BadRequestException('Invalid shop');

        const user = await this.usersService.findOne(dto.processed_by_user);
        if (!user) throw new BadRequestException('Invalid processed_by_user');

        const {
            consignor_id,
            shop_id,
            processed_by_user,
            ...data
        } = dto;

        const settlement = this.settlementRepo.create(data);
        settlement.consignor = consignor;
        settlement.shop = shop;
        settlement.processed_by_user = user;

        return await this.settlementRepo.save(settlement);
    }

    /**
     * Get all settlements with related data
     */
    async findAll(): Promise<ConsignmentSettlement[]> {
        return await this.settlementRepo.find({
            relations: ['consignor', 'shop', 'processed_by_user'],
            order: { settlement_id: 'DESC' },
        });
    }

    /**
     * Get a single settlement by ID
     */
    async findOne(id: number): Promise<ConsignmentSettlement> {
        const record = await this.settlementRepo.findOne({
            where: { settlement_id: id },
            relations: ['consignor', 'shop', 'processed_by_user'],
        });
        if (!record) throw new NotFoundException('Settlement not found');
        return record;
    }

    /**
     * Update settlement details
     */
    async update(
        id: number,
        dto: UpdateConsignmentSettlementDto,
    ): Promise<ConsignmentSettlement> {
        const settlement = await this.findOne(id);

        if (dto.consignor_id) {
            const consignor = await this.consignorsService.findOne(dto.consignor_id);
            if (!consignor) throw new BadRequestException('Invalid consignor');
            settlement.consignor = consignor;
        }

        if (dto.shop_id) {
            const shop = await this.shopsService.findOne(dto.shop_id);
            if (!shop) throw new BadRequestException('Invalid shop');
            settlement.shop = shop;
        }

        if (dto.processed_by_user) {
            const user = await this.usersService.findOne(dto.processed_by_user);
            if (!user) throw new BadRequestException('Invalid user');
            settlement.processed_by_user = user;
        }

        Object.assign(settlement, dto);

        return await this.settlementRepo.save(settlement);
    }

    /**
     * Delete a settlement record
     */
    async remove(id: number): Promise<void> {
        const settlement = await this.findOne(id);
        await this.settlementRepo.remove(settlement);
    }
}
