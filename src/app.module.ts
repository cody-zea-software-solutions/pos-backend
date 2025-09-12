import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'process';
import { BusinessModule } from './modules/business/business.module';
import { ShopModule } from './modules/shop/shop.module';
import { UsersModule } from './modules/users/users.module';
import { CounterModule } from './modules/counter/counter.module';
import { ShiftModule } from './modules/shift/shift.module';
import { ProductGroupModule } from './modules/product-group/product-group.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { AuthModule } from './modules/auth/auth.module';

import { CustomerModule } from './modules/loyalty-management/customer/customer.module';
import { LoyaltyLevelsModule } from './modules/loyalty-management/loyalty-levels/loyalty-levels.module';

import { LoyaltyRewardsModule } from './modules/loyalty-management/loyalty-rewards/loyalty-rewards.module';
import { LoyaltyPointsModule } from './modules/loyalty-management/loyalty-points/loyalty-points.module';
import { ProductSubcategoryModule } from './modules/product-subcategory/product-subcategory.module';
import { CustomerRewardsModule } from './modules/loyalty-management/customer-rewards/customer-rewards.module';
import { ProductUnitsModule } from './modules/product-units/product-units.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') as string),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Set to false in production
        autoLoadEntities: true,
      }),
    }),

    BusinessModule,

    ShopModule,

    UsersModule,

    CounterModule,

    ShiftModule,

    ProductGroupModule,

    ProductCategoryModule,

    AuthModule,

    CustomerModule,

    LoyaltyLevelsModule,

    LoyaltyRewardsModule,

    LoyaltyPointsModule,

    ProductSubcategoryModule,

    CustomerRewardsModule,

    ProductUnitsModule,

  ],

})
export class AppModule {}
