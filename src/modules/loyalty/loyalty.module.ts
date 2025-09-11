import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyLevel } from './loyalty.entity';
import { LoyaltyService } from './loyalty.service';
import { LoyaltyController } from './loyalty.controller';

@Module({

  imports: [TypeOrmModule.forFeature([LoyaltyLevel])],
  providers: [LoyaltyService],
  controllers: [LoyaltyController]
})
export class LoyaltyModule {}
