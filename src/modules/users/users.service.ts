import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ShopService } from '../shop/shop.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private shopService: ShopService,
    ) { }

    async create(dto: CreateUserDto): Promise<User> {
        // check if username or email already exists
        const existingUsername = await this.userRepo.findOne({
            where: { username: dto.username },
        });

        if (existingUsername) {
            throw new ConflictException('Username already exists');
        }

        const existingEmail = await this.userRepo.findOne({
            where: { email: dto.email },
        });

        if (existingEmail) {
            throw new ConflictException('E-mail already exists');
        }

        // check if the assigned shop exists
        const shop = await this.shopService.findOne(dto.assigned_shop_id as number);
        if (!shop) {
            throw new NotFoundException(`Shop with ID ${dto.assigned_shop_id} not found`);
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = this.userRepo.create({
            ...dto,
            password_hash: hashedPassword,
            assigned_shop: shop,
        });

        return this.userRepo.save(user);
    }

    findAll(): Promise<User[]> {
        return this.userRepo.find({ relations: ['assigned_shop'] });
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepo.findOne({
            where: { user_id: id },
            relations: ['assigned_shop'],
        });
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);
        return user;
    }

    async update(id: number, dto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        // check if the assigned shop exists
        const shop = await this.shopService.findOne(dto.assigned_shop_id as number);
        if (!shop) {
            throw new NotFoundException(`Shop with ID ${dto.assigned_shop_id} not found`);
        }

        if (dto.password) {
            user.password_hash = await bcrypt.hash(dto.password, 10);
            delete dto.password;
        }

        Object.assign(user, dto);
        return this.userRepo.save(user);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.userRepo.remove(user);
    }

    async findByUsername(username: string): Promise<User> {
        const user = await this.userRepo.findOne({
            where: { username },
            relations: ['assigned_shop'],
        });
        if (!user) throw new NotFoundException(`User with username "${username}" not found`);
        return user;
    }
}
