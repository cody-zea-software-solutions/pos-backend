import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceResource } from './service-resources.entity';
import { ServiceResourcesController } from './service-resources.controller';
import { ServiceResourcesService } from './service-resources.service';
import { Shop } from 'src/modules/shop/shop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceResource, Shop])],
  controllers: [ServiceResourcesController],
  providers: [ServiceResourcesService],
})
export class ServiceResourcesModule {}
