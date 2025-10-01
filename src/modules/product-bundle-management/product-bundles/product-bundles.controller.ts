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
import { ProductBundlesService } from './product-bundles.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateProductBundleDto } from './dto/create-product-bundle.dto';
import { UpdateProductBundleDto } from './dto/update-product-bundle.dto';

@Controller('product-bundles')
export class ProductBundlesController {
    constructor(private readonly bundleService: ProductBundlesService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/product-bundles',
                filename: (req, file, cb) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
        }),
    )
    create(@Body() dto: CreateProductBundleDto, @UploadedFile() file?: Express.Multer.File) {
        return this.bundleService.create(dto, file);
    }

    @Get()
    findAll() {
        return this.bundleService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bundleService.findOne(+id);
    }

    @Put(':id')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/product-bundles',
                filename: (req, file, cb) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
        }),
    )
    update(@Param('id') id: string, @Body() dto: UpdateProductBundleDto, @UploadedFile() file?: Express.Multer.File) {
        return this.bundleService.update(+id, dto, file);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bundleService.remove(+id);
    }

    // Search by name
    @Get('search/name/:name')
    findByName(@Param('name') name: string) {
        return this.bundleService.findByName(name);
    }

    // Search by bundle code
    @Get('search/code/:code')
    findByCode(@Param('code') code: string) {
        return this.bundleService.findByCode(code);
    }
}
