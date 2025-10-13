import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierOutstanding } from './supplier-outstanding.entity';
import { Repository } from 'typeorm';
import { ShopService } from '../../shop/shop.service';
import { SupplierService } from '../supplier/supplier.service';
import { GoodsReceivedNotesService } from '../goods-received-notes/goods-received-notes.service';
import { CreateSupplierOutstandingDto } from './dto/create-supplier-outstanding.dto';
import { UpdateSupplierOutstandingDto } from './dto/update-supplier-outstanding.dto';

@Injectable()
export class SupplierOutstandingsService {
    constructor(
        @InjectRepository(SupplierOutstanding)
        private readonly outRepo: Repository<SupplierOutstanding>,
        private readonly shopService: ShopService,
        private readonly supplierService: SupplierService,
        @Inject(forwardRef(() => GoodsReceivedNotesService))
        private readonly grnService: GoodsReceivedNotesService,
    ) { }

    async create(dto: CreateSupplierOutstandingDto): Promise<SupplierOutstanding> {
        const shop = await this.shopService.findOne(dto.shop_id);
        const supplier = await this.supplierService.findOne(dto.supplier_id);
        const grn = dto.grn_id ? await this.grnService.findOne(dto.grn_id) : null;

        const { shop_id, supplier_id, grn_id, ...data } = dto;
        const outstanding = this.outRepo.create(data);

        outstanding.shop = shop;
        outstanding.supplier = supplier;
        if (grn) outstanding.grn = grn;

        return this.outRepo.save(outstanding);
    }

    async findAll(): Promise<SupplierOutstanding[]> {
        return this.outRepo.find({
            relations: ['shop', 'supplier', 'grn'],
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: number): Promise<SupplierOutstanding> {
        const outstanding = await this.outRepo.findOne({
            where: { outstanding_id: id },
            relations: ['shop', 'supplier', 'grn'],
        });

        if (!outstanding)
            throw new NotFoundException(`Outstanding #${id} not found`);

        return outstanding; 
    }

    async update(id: number, dto: UpdateSupplierOutstandingDto) {
        const outstanding = await this.findOne(id);

        if (dto.shop_id) outstanding.shop = await this.shopService.findOne(dto.shop_id);
        if (dto.supplier_id)
            outstanding.supplier = await this.supplierService.findOne(dto.supplier_id);
        if (dto.grn_id)
            outstanding.grn = await this.grnService.findOne(dto.grn_id);

        Object.assign(outstanding, dto);
        return this.outRepo.save(outstanding);
    }

    async remove(id: number): Promise<void> {
        const outstanding = await this.findOne(id);
        await this.outRepo.remove(outstanding);
    }

    async findBySupplier(supplier_id: number): Promise<SupplierOutstanding[]> {
        await this.supplierService.findOne(supplier_id);

        return this.outRepo.find({
            where: { supplier: { supplier_id } },
            relations: ['shop', 'supplier', 'grn'],
        });
    }
}
