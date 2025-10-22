import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierPayment, SupplierPaymentStatus } from './supplier-payment.entity';
import { Repository } from 'typeorm';
import { ShopService } from '../../shop/shop.service';
import { SupplierService } from '../supplier/supplier.service';
import { UsersService } from '../../users/users.service';
import { CreateSupplierPaymentDto } from './dto/create-supplier-payment.dto';
import { UpdateSupplierPaymentDto } from './dto/update-supplier-payment.dto';
import { GoodsReceivedNote, GrnPaymentStatus } from '../goods-received-notes/goods-received-note.entity';

@Injectable()
export class SupplierPaymentsService {
    constructor(
        @InjectRepository(SupplierPayment)
        private readonly paymentRepo: Repository<SupplierPayment>,
        @InjectRepository(GoodsReceivedNote)
        private readonly grnRepository: Repository<GoodsReceivedNote>,
        private readonly shopService: ShopService,
        private readonly supplierService: SupplierService,
        private readonly userService: UsersService,
    ) { }

    private async updateGrnPaymentStatus(grn: GoodsReceivedNote): Promise<void> {
        const total = Number(grn.total_amount ?? 0);
        const outstanding = Number(grn.total_outstanding_amount ?? 0);

        if (outstanding <= 0) {
            grn.payment_status = GrnPaymentStatus.PAID;
        } else if (outstanding < total) {
            grn.payment_status = GrnPaymentStatus.PARTIAL;
        } else {
            grn.payment_status = GrnPaymentStatus.PENDING;
        }

        await this.grnRepository.save(grn);
    }

    // CREATE PAYMENT
    async create(dto: CreateSupplierPaymentDto): Promise<SupplierPayment> {
        const shop = await this.shopService.findOne(dto.shop_id);
        if (!shop) throw new NotFoundException(`Shop ${dto.shop_id} not found`);

        const supplier = await this.supplierService.findOne(dto.supplier_id);
        if (!supplier)
            throw new NotFoundException(`Supplier ${dto.supplier_id} not found`);

        const createdByUser = dto.created_by_user
            ? await this.userService.findOne(dto.created_by_user)
            : null;

        const paidByUser = dto.paid_by_user
            ? await this.userService.findOne(dto.paid_by_user)
            : null;

        // Preload GRN before creating payment
        let grn: GoodsReceivedNote | null = null;
        if (dto.grn_id) {
            grn = await this.grnRepository.findOne({ where: { grn_id: dto.grn_id } });
            if (!grn) throw new NotFoundException(`GRN ${dto.grn_id} not found`);
        }

        const { shop_id, supplier_id, created_by_user, paid_by_user, grn_id, ...data } = dto;

        const payment = this.paymentRepo.create(data);
        payment.shop = shop;
        payment.supplier = supplier;
        if (createdByUser) payment.created_by_user = createdByUser;
        if (paidByUser) {
            payment.paid_by_user = paidByUser;
            payment.paid_at = new Date();
        }
        if (grn) payment.grn = grn; // assign before saving

        payment.status = dto.status ?? SupplierPaymentStatus.DRAFT;

        const savedPayment = await this.paymentRepo.save(payment);

        // Handle post-save logic only after full relation persistence

        if (savedPayment.status === SupplierPaymentStatus.PAID) {
            // Update supplier outstanding
            await this.supplierService.updateOutstandingAfterGrn(
                supplier.supplier_id,
                -savedPayment.payment_amount,
            );

            // Update last payment date
            const updatedSupplier = await this.supplierService.findOne(supplier_id);
            updatedSupplier.last_payment_date = new Date();
            await this.supplierService.saveSupplier(updatedSupplier);
        }

        // Update GRN totals if linked
        if (grn && savedPayment.status === SupplierPaymentStatus.PAID) {
            grn.total_outstanding_amount =
                Number(grn.total_outstanding_amount ?? 0) - Number(payment.payment_amount);
            await this.grnRepository.save(grn);
            await this.updateGrnPaymentStatus(grn);
        }

        return savedPayment;
    }


    // FIND ALL
    async findAll(): Promise<SupplierPayment[]> {
        return this.paymentRepo.find({
            relations: ['shop', 'supplier', 'created_by_user', 'paid_by_user'],
            order: { created_at: 'DESC' },
        });
    }

    // FIND ONE
    async findOne(id: number): Promise<SupplierPayment> {
        const payment = await this.paymentRepo.findOne({
            where: { payment_id: id },
            relations: ['shop', 'supplier', 'created_by_user', 'paid_by_user'],
        });
        if (!payment) throw new NotFoundException(`Payment #${id} not found`);
        return payment;
    }

    // UPDATE
    async update(id: number, dto: UpdateSupplierPaymentDto): Promise<SupplierPayment> {
        const payment = await this.findOne(id);

        const oldStatus = payment.status;
        const oldAmount = Number(payment.payment_amount);

        // Relations
        if (dto.shop_id && dto.shop_id !== payment.shop?.shop_id)
            payment.shop = await this.shopService.findOne(dto.shop_id);

        if (dto.supplier_id && dto.supplier_id !== payment.supplier?.supplier_id)
            payment.supplier = await this.supplierService.findOne(dto.supplier_id);

        if (dto.created_by_user)
            payment.created_by_user = await this.userService.findOne(dto.created_by_user);

        if (dto.paid_by_user) {
            payment.paid_by_user = await this.userService.findOne(dto.paid_by_user);
            payment.paid_at = new Date();
        }

        if (dto.grn_id) {
            const grn = await this.grnRepository.findOne({ where: { grn_id: dto.grn_id } });
            if (!grn) throw new NotFoundException('GRN not found');
            payment.grn = grn;
        }

        // Apply changes
        Object.assign(payment, dto);

        const saved = await this.paymentRepo.save(payment);

        // ---------------------------
        // Outstanding Adjustments
        // ---------------------------
        const supplier = payment.supplier;
        const supplierId = payment.supplier.supplier_id;
        const grn = payment.grn;
        const newAmount = Number(payment.payment_amount);
        const newStatus = payment.status;

        // Case 1: Status changed
        if (oldStatus !== newStatus) {
            if (oldStatus !== 'PAID' && newStatus === 'PAID') {
                // Payment newly marked as paid → reduce supplier/grn outstanding
                await this.supplierService.updateOutstandingAfterGrn(supplierId, -newAmount);

                // Update supplier last payment date
                const updatedSupplier = await this.supplierService.findOne(supplierId);
                updatedSupplier.last_payment_date = new Date();
                await this.supplierService.saveSupplier(updatedSupplier);

                if (grn) {
                    grn.total_outstanding_amount =
                        Number(grn.total_outstanding_amount ?? 0) - newAmount;
                    await this.grnRepository.save(grn);
                    await this.updateGrnPaymentStatus(grn);
                }
            } else if (oldStatus === 'PAID' && newStatus === 'CANCELLED') {
                // Payment cancelled → restore outstanding
                await this.supplierService.updateOutstandingAfterGrn(supplierId, +oldAmount);
                if (grn) {
                    grn.total_outstanding_amount =
                        Number(grn.total_outstanding_amount ?? 0) + oldAmount;
                    await this.grnRepository.save(grn);
                    await this.updateGrnPaymentStatus(grn);
                }
            }
        }
        // Case 2: Amount changed (still paid)
        else if (newStatus === 'PAID' && newAmount !== oldAmount) {
            const diff = newAmount - oldAmount;
            await this.supplierService.updateOutstandingAfterGrn(supplierId, -diff);
            if (grn) {
                grn.total_outstanding_amount =
                    Number(grn.total_outstanding_amount ?? 0) - diff;
                await this.grnRepository.save(grn);
                await this.updateGrnPaymentStatus(grn);
            }

            // Also refresh supplier last payment date
            const updatedSupplier = await this.supplierService.findOne(supplierId);
            updatedSupplier.last_payment_date = new Date();
            await this.supplierService.saveSupplier(updatedSupplier);
        }

        return saved;
    }


    // DELETE
    async remove(id: number): Promise<void> {
        const payment = await this.findOne(id);
        await this.paymentRepo.remove(payment);
    }
}
