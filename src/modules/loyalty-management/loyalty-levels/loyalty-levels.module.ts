import { Module } from '@nestjs/common';
import { LoyaltyLevelsController } from './loyalty-levels.controller';
import { LoyaltyLevelsService } from './loyalty-levels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyLevel } from './loyalty-levels.entity';
@Module({
   imports: [TypeOrmModule.forFeature([LoyaltyLevel])],
  controllers: [LoyaltyLevelsController],
  providers: [LoyaltyLevelsService]
})
export class LoyaltyLevelsModule {}
