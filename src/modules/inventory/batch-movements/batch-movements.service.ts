import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchMovement } from './batch-movement.entity';
import { Batch } from '../batches/batches.entity';
import { Shop } from '../../shop/shop.entity';
import { User } from '../../users/user.entity';
import { Repository } from 'typeorm';
import { ShopInventory } from '../shop-inventory/shop-inventory.entity';
import { UsersService } from '../../users/users.service';
import { CreateBatchMovementDto } from './dto/create-batch-movement.dto';
import { UpdateBatchMovementDto } from './dto/update-batch-movement.dto';

@Injectable()
export class BatchMovementsService {
    constructor(
        @InjectRepository(BatchMovement)
        private readonly movementRepo: Repository<BatchMovement>,

        @InjectRepository(Batch)
        private readonly batchRepo: Repository<Batch>,

        @InjectRepository(Shop)
        private readonly shopRepo: Repository<Shop>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(ShopInventory)
        private readonly inventoryRepo: Repository<ShopInventory>,

        private readonly usersService: UsersService,
    ) { }

    async create(dto: CreateBatchMovementDto): Promise<BatchMovement> {
        // Validate batch
        const batch = await this.batchRepo.findOne({ where: { batch_id: dto.batch_id } });
        if (!batch) throw new NotFoundException('Batch not found');

        // Validate authorized user
        const authorizedUser = await this.usersService.findOne(dto.authorized_by_user);

        // Validate shops
        const fromShop = dto.from_shop_id
            ? await this.shopRepo.findOne({ where: { shop_id: dto.from_shop_id } })
            : null;
        const toShop = dto.to_shop_id
            ? await this.shopRepo.findOne({ where: { shop_id: dto.to_shop_id } })
            : null;

        if (!fromShop && !toShop) {
            throw new ConflictException('Either from_shop_id or to_shop_id must be provided.');
        }

        // ----------------------------
        // Check source shop inventory
        // ----------------------------
        if (fromShop) {
            const sourceInventory = await this.inventoryRepo.findOne({
                where: {
                    shop: { shop_id: fromShop.shop_id },
                    batch: { batch_id: batch.batch_id },
                },
            });

            if (!sourceInventory || sourceInventory.available_quantity < dto.quantity_moved) {
                throw new ConflictException(
                    `Not enough stock in source shop. Available: ${sourceInventory?.available_quantity ?? 0}, Requested: ${dto.quantity_moved}`,
                );
            }
        }

        // Create movement record
        const { from_shop_id, to_shop_id, batch_id, authorized_by_user, ...data } = dto;

        const movement = this.movementRepo.create(data);
        movement.batch = batch;
        if (fromShop) movement.from_shop = fromShop;
        if (toShop) movement.to_shop = toShop;
        movement.authorized_by_user = authorizedUser;

        const savedMovement = await this.movementRepo.save(movement);

        // Handle inventory updates automatically
        await this.updateInventoriesOnMovement(batch, fromShop, toShop, dto.quantity_moved);

        return savedMovement;
    }

    async findAll(): Promise<BatchMovement[]> {
        return this.movementRepo.find({
            order: { movement_date: 'DESC' },
        });
    }

    async findOne(id: number): Promise<BatchMovement> {
        const movement = await this.movementRepo.findOne({
            where: { movement_id: id },
        });
        if (!movement) throw new NotFoundException(`Batch movement ${id} not found`);
        return movement;
    }

    // async update(
    //     id: number,
    //     dto: UpdateBatchMovementDto,
    // ): Promise<BatchMovement> {
    //     const movement = await this.findOne(id);

    //     if (dto.batch_id) {
    //         const batch = await this.batchRepo.findOne({
    //             where: { batch_id: dto.batch_id },
    //         });
    //         if (!batch) {
    //             throw new NotFoundException(`Batch with ID ${dto.batch_id} not found`);
    //         }
    //         movement.batch = batch;
    //     }


    //     if (dto.from_shop_id) {
    //         const fromShop = await this.shopRepo.findOne({
    //             where: { shop_id: dto.from_shop_id },
    //         });
    //         if (!fromShop) {
    //             throw new NotFoundException(`Shop with ID ${dto.from_shop_id} not found`);
    //         }
    //     }

    //     if (dto.to_shop_id) {
    //         const toShop = await this.shopRepo.findOne({
    //             where: { shop_id: dto.to_shop_id },
    //         });
    //         if (!toShop) {
    //             throw new NotFoundException(`Shop with ID ${dto.to_shop_id} not found`);
    //         }
    //     }


    //     if (dto.authorized_by_user) {
    //         const authorizedUser = await this.userRepo.findOne({
    //             where: { user_id: dto.authorized_by_user },
    //         });
    //         if (!authorizedUser) {
    //             throw new NotFoundException(`User with ID ${dto.authorized_by_user} not found`);
    //         }
    //         movement.authorized_by_user = authorizedUser;
    //     }

    //     Object.assign(movement, dto);
    //     return this.movementRepo.save(movement);
    // }

    // async remove(id: number): Promise<void> {
    //     const movement = await this.findOne(id);
    //     await this.movementRepo.remove(movement);
    // }

    // Automatic inventory update logic
    private async updateInventoriesOnMovement(
        batch: Batch,
        fromShop: Shop | null,
        toShop: Shop | null,
        qtyMoved: number,
    ) {
        // Decrease from source shop inventory
        if (fromShop) {
            const sourceInventory = await this.inventoryRepo.findOne({
                where: {
                    shop: { shop_id: fromShop.shop_id },
                    batch: { batch_id: batch.batch_id },
                },
            });

            if (!sourceInventory) {
                throw new ConflictException(
                    `No inventory found for batch ${batch.batch_number} in source shop ${fromShop.shop_id}`,
                );
            }

            if (sourceInventory.available_quantity < qtyMoved) {
                throw new ConflictException(
                    `Not enough stock in source shop. Available: ${sourceInventory.available_quantity}, Requested: ${qtyMoved}`,
                );
            }

            sourceInventory.available_quantity -= qtyMoved;
            await this.inventoryRepo.save(sourceInventory);
        }

        // Increase in destination shop inventory
        if (toShop) {
            let targetInventory = await this.inventoryRepo.findOne({
                where: {
                    shop: { shop_id: toShop.shop_id },
                    batch: { batch_id: batch.batch_id },
                },
            });

            if (targetInventory) {
                targetInventory.available_quantity += qtyMoved;
            } else {
                targetInventory = this.inventoryRepo.create({
                    shop: toShop,
                    product: batch.product,
                    variation: batch.variation || undefined,
                    batch,
                    available_quantity: qtyMoved,
                    reserved_quantity: 0,
                    minimum_stock_level: 0,
                    last_updated_by: undefined,
                    is_consignment: batch.is_consignment,
                    consignor: batch.consignor || undefined,
                });
            }

            await this.inventoryRepo.save(targetInventory);
        }
    }
}
