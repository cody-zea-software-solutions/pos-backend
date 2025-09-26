import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/services',
                filename: (req, file, cb) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
        }),
    )
    create(@Body() dto: CreateServiceDto, @UploadedFile() file?: Express.Multer.File) {
        return this.servicesService.create(dto, file);
    }

    @Get()
    findAll() {
        return this.servicesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.servicesService.findOne(+id);
    }

    @Put(':id')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/services',
                filename: (req, file, cb) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
        }),
    )
    update(
        @Param('id') id: string,
        @Body() dto: UpdateServiceDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.servicesService.update(+id, dto, file);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.servicesService.remove(+id);
    }

    @Get('search/name/:name')
    findByName(@Param('name') name: string) {
        return this.servicesService.findByName(name);
    }
}
