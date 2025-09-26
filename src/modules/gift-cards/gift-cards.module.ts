import { Module } from '@nestjs/common';
import { GiftCardsService } from './gift-cards.service';
import { GiftCardsController } from './gift-cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftCard } from './gift-card.entity';
import { UsersModule } from '../users/users.module';
import { CustomerModule } from '../loyalty-management/customer/customer.module';

@Module({
  imports: [TypeOrmModule.forFeature([GiftCard]), UsersModule, CustomerModule],
  providers: [GiftCardsService],
  controllers: [GiftCardsController],
  exports: [GiftCardsService],
})
export class GiftCardsModule {}
