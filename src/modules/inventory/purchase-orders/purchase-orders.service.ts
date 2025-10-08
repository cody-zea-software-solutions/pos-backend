import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder, PurchaseOrderStatus } from './purchase-order.entity';
import { Repository } from 'typeorm';
import { ShopService } from 'src/modules/shop/shop.service';
import { SupplierService } from '../supplier/supplier.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
    constructor(
        @InjectRepository(PurchaseOrder)
        private readonly poRepo: Repository<PurchaseOrder>,
        private readonly shopService: ShopService,
        private readonly supplierService: SupplierService,
        private readonly userService: UsersService,
    ) { }

    async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {

        // Check for duplicate code
        const exists = await this.poRepo.findOne({
            where: { po_number: dto.po_number },
        });
        if (exists)
            throw new ConflictException(
                `Purchase order number '${dto.po_number}' already exists`,
            );

        // Validate foreign keys
        const shop = await this.shopService.findOne(dto.shop_id);
        if (!shop) throw new NotFoundException(`Shop ${dto.shop_id} not found`);

        const supplier = await this.supplierService.findOne(dto.supplier_id);
        if (!supplier)
            throw new NotFoundException(`Supplier ${dto.supplier_id} not found`);

        const createdByUser = dto.created_by_user
            ? await this.userService.findOne(dto.created_by_user)
            : null;

        const approvedByUser = dto.approved_by_user
            ? await this.userService.findOne(dto.approved_by_user)
            : null;

        const {
            shop_id,
            supplier_id,
            created_by_user,
            approved_by_user,
            ...data
        } = dto;

        const po = this.poRepo.create(data);

        // Assign relationships
        if (shop) po.shop = shop;
        if (supplier) po.supplier = supplier;
        if (createdByUser) po.created_by_user = createdByUser;
        if (approvedByUser) po.approved_by_user = approvedByUser;

        // Set default status if not provided
        if (!po.status) po.status = PurchaseOrderStatus.DRAFT;

        return this.poRepo.save(po);
    }

    async findAll(): Promise<PurchaseOrder[]> {
        return this.poRepo.find({
            relations: ['shop', 'supplier', 'created_by_user', 'approved_by_user'],
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: number): Promise<PurchaseOrder> {
        const po = await this.poRepo.findOne({
            where: { po_id: id },
            relations: ['shop', 'supplier', 'created_by_user', 'approved_by_user'],
        });
        if (!po) throw new NotFoundException(`Purchase order #${id} not found`);
        return po;
    }

    async update(id: number, dto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
        const po = await this.findOne(id);

        // Update status only if provided and different
        if (dto.status && dto.status !== po.status) {
            po.status = dto.status;
        }

        // Update approval details if applicable
        if (dto.approved_by_user) {
            const user = await this.userService.findOne(dto.approved_by_user);
            po.approved_by_user = user;
            po.approved_at = new Date();
        }

        // Handle other relations (optional updates)
        if (dto.shop_id) {
            const shop = await this.shopService.findOne(dto.shop_id);
            po.shop = shop;
        }

        if (dto.supplier_id) {
            const supplier = await this.supplierService.findOne(dto.supplier_id);
            po.supplier = supplier;
        }

        if (dto.created_by_user) {
            const createdByUser = await this.userService.findOne(dto.created_by_user);
            po.created_by_user = createdByUser;
        }

        // Extract relational keys before assigning primitives
        const {
            shop_id,
            supplier_id,
            created_by_user,
            approved_by_user,
            ...data
        } = dto;

        Object.assign(po, data);

        return this.poRepo.save(po);
    }

    async remove(id: number): Promise<void> {
        const po = await this.findOne(id);
        await this.poRepo.remove(po);
    }

    async findByPoNumber(po_number: string): Promise<PurchaseOrder> {
        const po = await this.poRepo.findOne({
            where: { po_number },
            relations: [
                'shop',
                'supplier',
                'created_by_user',
                'approved_by_user',
            ],
        });

        if (!po) {
            throw new NotFoundException(`Purchase Order '${po_number}' not found`);
        }

        return po;
    }
}
