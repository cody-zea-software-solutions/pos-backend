import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceResourceRequirement } from './service-resource-requirements.entity';
import { ServiceResourcesRequirementsService } from './service-resource-requirements.service';
import { ServiceResourcesRequirementsController } from './service-resource-requirements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceResourceRequirement])],
  controllers: [ServiceResourcesRequirementsController],
  providers: [ServiceResourcesRequirementsService],
})
export class ServiceResourcesRequirementsModule {}
