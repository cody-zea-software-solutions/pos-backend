import { PartialType } from '@nestjs/mapped-types';
import { CreateBatchMovementDto } from './create-batch-movement.dto';

export class UpdateBatchMovementDto extends PartialType(CreateBatchMovementDto) {}