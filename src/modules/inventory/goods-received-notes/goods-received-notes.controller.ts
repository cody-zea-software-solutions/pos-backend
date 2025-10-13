import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    ParseIntPipe,
} from '@nestjs/common';
import { GoodsReceivedNotesService } from './goods-received-notes.service';
import { CreateGoodsReceivedNoteDto } from './dto/create-goods-received-note.dto';
import { UpdateGoodsReceivedNoteDto } from './dto/update-goods-received-note.dto';

@Controller('goods-received-notes')
export class GoodsReceivedNotesController {
    constructor(private readonly grnService: GoodsReceivedNotesService) { }

    // CREATE GRN
    @Post()
    async create(@Body() dto: CreateGoodsReceivedNoteDto) {
        return this.grnService.create(dto);
    }

    // GET ALL GRNs
    @Get()
    async findAll() {
        return this.grnService.findAll();
    }

    // GET GRN BY ID
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.grnService.findOne(id);
    }

    // GET GRN BY NUMBER
    @Get('number/:grn_number')
    async findByGrnNumber(@Param('grn_number') grn_number: string) {
        return this.grnService.findByGrnNumber(grn_number);
    }

    // UPDATE GRN
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateGoodsReceivedNoteDto,
    ) {
        return this.grnService.update(id, dto);
    }

    // DELETE GRN
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.grnService.remove(id);
    }
}
