import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Patch,
    Delete,
    ParseIntPipe,
    Put,
} from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@Controller('subscription-plan')
export class SubscriptionPlanController {
    constructor(private readonly planService: SubscriptionPlanService) { }

    @Post()
    create(@Body() dto: CreateSubscriptionPlanDto) {
        return this.planService.create(dto);
    }

    @Get()
    findAll() {
        return this.planService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.planService.findOne(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubscriptionPlanDto) {
        return this.planService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.planService.remove(id);
    }
}
