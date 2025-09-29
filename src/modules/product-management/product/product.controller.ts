import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Put,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/products',
                filename: (req, file, cb) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
        }),
    )
    create(@Body() dto: CreateProductDto, @UploadedFile() file?: Express.Multer.File) {
        return this.productService.create(dto, file);
    }

    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(+id);
    }

    @Put(':id')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/products',
                filename: (req, file, cb) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
        }),
    )
    update(@Param('id') id: string, @Body() dto: UpdateProductDto, @UploadedFile() file?: Express.Multer.File,) {
        return this.productService.update(+id, dto, file);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(+id);
    }

    //Search by name (case-insensitive, partial match)
    @Get('search/name/:name')
    findByName(@Param('name') name: string) {
        return this.productService.findByName(name);
    }

    //Search by barcode (exact match)
    @Get('search/barcode/:barcode')
    findByBarcode(@Param('barcode') barcode: string) {
        return this.productService.findByBarcode(barcode);
    }
}
