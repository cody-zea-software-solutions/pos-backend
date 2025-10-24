import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'process';
import { BusinessModule } from './modules/business/business.module';
import { ShopModule } from './modules/shop/shop.module';
import { UsersModule } from './modules/users/users.module';
import { CounterModule } from './modules/counter/counter.module';
import { ShiftModule } from './modules/shift/shift.module';
import { AuthModule } from './modules/auth/auth.module';

import { CustomerModule } from './modules/loyalty-management/customer/customer.module';
import { LoyaltyLevelsModule } from './modules/loyalty-management/loyalty-levels/loyalty-levels.module';

import { LoyaltyRewardsModule } from './modules/loyalty-management/loyalty-rewards/loyalty-rewards.module';
import { LoyaltyPointsModule } from './modules/loyalty-management/loyalty-points/loyalty-points.module';
import { CustomerRewardsModule } from './modules/loyalty-management/customer-rewards/customer-rewards.module';
import { ProductGroupModule } from './modules/product-management/product-group/product-group.module';
import { ProductCategoryModule } from './modules/product-management/product-category/product-category.module';
import { ProductSubcategoryModule } from './modules/product-management/product-subcategory/product-subcategory.module';
import { ProductUnitsModule } from './modules/product-management/product-units/product-units.module';
import { ConsignorModule } from './modules/inventory/consignor/consignor.module';
import { ProductModule } from './modules/product-management/product/product.module';
import { ProductVariationModule } from './modules/product-management/product-variation/product-variation.module';
import { SupplierModule } from './modules/inventory/supplier/supplier.module';
import { DiscountModule } from './modules/discount/discount.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { TransactionsModule } from './modules/pos-transactions/transactions/transactions.module';
import { TransactionItemsModule } from './modules/pos-transactions/transaction-items/transaction-items.module';
import { PaymentsModule } from './modules/pos-transactions/payments/payments.module';
import { RefundModule } from './modules/refund-process/refund/refund.module';
import { RefundItemsModule } from './modules/refund-process/refund-items/refund-items.module';
import { RefundApprovalsModule } from './modules/refund-process/refund-approvals/refund-approvals.module';
import { ServicesModule } from './modules/service-management/services/services.module';
import { GiftCardsModule } from './modules/gift-cards/gift-cards.module';
import { ProductBundlesModule } from './modules/product-bundle-management/product-bundles/product-bundles.module';
import { BundleItemsModule } from './modules/product-bundle-management/bundle-items/bundle-items.module';
import { SubscriptionPlanModule } from './modules/subscription-plan/subscription-plan.module';
import { PurchaseOrdersModule } from './modules/inventory/purchase-orders/purchase-orders.module';
import { PurchaseOrderItemsModule } from './modules/inventory/purchase-order-items/purchase-order-items.module';
import { SupplierOutstandingsModule } from './modules/inventory/supplier-outstandings/supplier-outstandings.module';
import { GoodsReceivedNotesModule } from './modules/inventory/goods-received-notes/goods-received-notes.module';
import { SupplierPaymentsModule } from './modules/inventory/supplier-payments/supplier-payments.module';
import { GrnItemsModule } from './modules/inventory/grn-items/grn-items.module';
import { BatchesModule } from './modules/inventory/batches/batches.module';
import { ShopInventoryModule } from './modules/inventory/shop-inventory/shop-inventory.module';
import { BatchMovementsModule } from './modules/inventory/batch-movements/batch-movements.module';
import { GstRatesModule } from './modules/gst-management/gst-rates/gst-rates.module';
import { GstTransactionsModule } from './modules/gst-management/gst-transactions/gst-transactions.module';
import { GstItemDetailsModule } from './modules/gst-management/gst-item-details/gst-item-details.module';
import { GstReturnModule } from './modules/gst-management/gst-return/gst-return.module';  //new update 
import { ConsignmentStockModule } from './modules/inventory/consignment-stock/consignment-stock.module';
import { ConsignmentSettlementsModule } from './modules/inventory/consignment-settlements/consignment-settlements.module';
import { InventoryReportsModule } from './modules/inventory/inventory-reports/inventory-reports.module';


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

    ConsignorModule,

    ProductModule,

    ProductVariationModule,

    SupplierModule,

    DiscountModule,

    PromotionModule,

    TransactionsModule,

    TransactionItemsModule,

    PaymentsModule,

    RefundModule,

    RefundItemsModule,

    RefundApprovalsModule,

    ServicesModule,

    GiftCardsModule,

    ProductBundlesModule,

    BundleItemsModule,

    SubscriptionPlanModule,

    PurchaseOrdersModule,

    PurchaseOrderItemsModule,

    SupplierOutstandingsModule,

    GoodsReceivedNotesModule,

    SupplierPaymentsModule,

    GrnItemsModule,

    BatchesModule,

    ShopInventoryModule,

    BatchMovementsModule,

    GstTransactionsModule,

    GstRatesModule,

    GstItemDetailsModule,

    ConsignmentStockModule,

    ConsignmentSettlementsModule,

    GstReturnModule,

    InventoryReportsModule,
  ],

})
export class AppModule {}
