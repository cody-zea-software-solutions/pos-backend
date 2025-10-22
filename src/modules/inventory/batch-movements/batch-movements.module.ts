import { Module } from '@nestjs/common';
import { BatchMovementsService } from './batch-movements.service';
import { BatchMovementsController } from './batch-movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchMovement } from './batch-movement.entity';
import { Batch } from '../batches/batches.entity';
import { Shop } from 'src/modules/shop/shop.entity';
import { User } from 'src/modules/users/user.entity';
import { ShopInventory } from '../shop-inventory/shop-inventory.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    BatchMovement,
    Batch,
    Shop,
    User,
    ShopInventory,
  ]), UsersModule],
  providers: [BatchMovementsService],
  controllers: [BatchMovementsController],
  exports: [BatchMovementsService],
})
export class BatchMovementsModule {}
