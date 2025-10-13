import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsReceivedNote, GrnStatus } from './goods-received-note.entity';
import { Repository } from 'typeorm';
import { ShopService } from 'src/modules/shop/shop.service';
import { SupplierService } from '../supplier/supplier.service';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { UsersService } from 'src/modules/users/users.service';
import { SupplierOutstandingsService } from '../supplier-outstandings/supplier-outstandings.service';
import { CreateGoodsReceivedNoteDto } from './dto/create-goods-received-note.dto';
import { SupplierOutstandingStatus } from '../supplier-outstandings/supplier-outstanding.entity';
import { UpdateGoodsReceivedNoteDto } from './dto/update-goods-received-note.dto';

@Injectable()
export class GoodsReceivedNotesService {
    constructor(
        @InjectRepository(GoodsReceivedNote)
        private readonly grnRepo: Repository<GoodsReceivedNote>,
        private readonly shopService: ShopService,
        private readonly supplierService: SupplierService,
        private readonly poService: PurchaseOrdersService,
        private readonly userService: UsersService,
        @Inject(forwardRef(() => SupplierOutstandingsService))
        private readonly supplierOutstandingsService: SupplierOutstandingsService,
    ) { }

    // CREATE GRN
    async create(dto: CreateGoodsReceivedNoteDto): Promise<GoodsReceivedNote> {

        const exists = await this.grnRepo.findOne({
            where: { grn_number: dto.grn_number },
        });
        if (exists) {
            throw new ConflictException(
                `GRN Number '${dto.grn_number}' already exists`,
            );
        }

        // Validate foreign keys
        const shop = await this.shopService.findOne(dto.shop_id);
        if (!shop) throw new NotFoundException(`Shop ${dto.shop_id} not found`);

        const supplier = await this.supplierService.findOne(dto.supplier_id);
        if (!supplier) throw new NotFoundException(`Supplier ${dto.supplier_id} not found`);

        const purchaseOrder = dto.purchase_order_id
            ? await this.poService.findOne(dto.purchase_order_id)
            : null;

        const receivedByUser = dto.received_by_user
            ? await this.userService.findOne(dto.received_by_user)
            : null;

        const verifiedByUser = dto.verified_by_user
            ? await this.userService.findOne(dto.verified_by_user)
            : null;

        const postedByUser = dto.posted_by_user
            ? await this.userService.findOne(dto.posted_by_user)
            : null;

        // Prepare GRN entity
        const { shop_id, supplier_id, purchase_order_id, received_by_user, verified_by_user, posted_by_user, ...data } = dto;

        const grn = this.grnRepo.create(data);
        grn.shop = shop;
        grn.supplier = supplier;
        if (purchaseOrder) grn.purchase_order = purchaseOrder;
        if (receivedByUser) grn.received_by_user = receivedByUser;
        if (verifiedByUser) grn.verified_by_user = verifiedByUser;
        if (postedByUser) grn.posted_by_user = postedByUser;
        grn.status = GrnStatus.RECEIVED;

        // Save GRN
        const savedGrn = await this.grnRepo.save(grn);

        // Auto-create Supplier Outstanding record
        const outstanding = await this.supplierOutstandingsService.create({
            shop_id: shop.shop_id,
            supplier_id: supplier.supplier_id,
            grn_id: savedGrn.grn_id,
            total_amount: savedGrn.total_amount,
            paid_amount: 0,
            due_date: dto.due_date ?? undefined,
            status: SupplierOutstandingStatus.PENDING,
        });

        // Update GRN total_outstanding_amount-
        savedGrn.total_outstanding_amount = outstanding.balance_amount;
        await this.grnRepo.save(savedGrn);

        // ask supplier service to recalculate aggregates
        // await this.supplierService.recalculateOutstandingAndUtilization(supplier.supplier_id);

        return savedGrn;
    }


    // FIND ALL
    async findAll(): Promise<GoodsReceivedNote[]> {
        return this.grnRepo.find({
            relations: [
                'shop',
                'supplier',
                'purchase_order',
                'received_by_user',
                'verified_by_user',
                'posted_by_user',
            ],
            order: { created_at: 'DESC' },
        });
    }

    // FIND ONE
    async findOne(id: number): Promise<GoodsReceivedNote> {
        const grn = await this.grnRepo.findOne({
            where: { grn_id: id },
            relations: [
                'shop',
                'supplier',
                'purchase_order',
                'received_by_user',
                'verified_by_user',
                'posted_by_user',
            ],
        });
        if (!grn) throw new NotFoundException(`GRN #${id} not found`);
        return grn;
    }

    // UPDATE
    async update(
        id: number,
        dto: UpdateGoodsReceivedNoteDto,
    ): Promise<GoodsReceivedNote> {
        const grn = await this.findOne(id);

        // Handle related updates
        if (dto.shop_id && dto.shop_id !== grn.shop.shop_id)
            grn.shop = await this.shopService.findOne(dto.shop_id);

        if (dto.supplier_id && dto.supplier_id !== grn.supplier.supplier_id)
            grn.supplier = await this.supplierService.findOne(dto.supplier_id);

        if (
            dto.purchase_order_id &&
            (!grn.purchase_order ||
                dto.purchase_order_id !== grn.purchase_order.po_id)
        ) {
            grn.purchase_order = await this.poService.findOne(dto.purchase_order_id);
        }

        if (dto.received_by_user)
            grn.received_by_user = await this.userService.findOne(dto.received_by_user);

        if (dto.verified_by_user)
            grn.verified_by_user = await this.userService.findOne(dto.verified_by_user);

        if (dto.posted_by_user)
            grn.posted_by_user = await this.userService.findOne(dto.posted_by_user);

        Object.assign(grn, dto);
        return this.grnRepo.save(grn);
    }

    // DELETE
    async remove(id: number): Promise<void> {
        const grn = await this.findOne(id);
        await this.grnRepo.remove(grn);
    }

    // FIND BY GRN NUMBER
    async findByGrnNumber(grn_number: string): Promise<GoodsReceivedNote> {
        const grn = await this.grnRepo.findOne({
            where: { grn_number },
            relations: ['shop', 'supplier', 'purchase_order'],
        });
        if (!grn) throw new NotFoundException(`GRN '${grn_number}' not found`);
        return grn;
    }
}
