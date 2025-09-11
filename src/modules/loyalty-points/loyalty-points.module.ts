import { Module } from '@nestjs/common';
import { LoyaltyPointsController } from './loyalty-points.controller';
import { LoyaltyPointsService } from './loyalty-points.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyPoints } from './loyalty-points.entity';
@Module({
   imports: [TypeOrmModule.forFeature([LoyaltyPoints])],
     exports: [LoyaltyPointsService],
  controllers: [LoyaltyPointsController],
  providers: [LoyaltyPointsService]
})
export class LoyaltyPointsModule {
  
}
